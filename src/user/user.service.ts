import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { MailService } from './../mail/mail.service';
import { LoginUserDto } from './dto/login-user.dto';
import { getClientIp } from 'request-ip';
import { IPinfoWrapper } from 'node-ipinfo';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { Ticket } from '../ticket/interfaces/ticket.interface';
import { User } from './interfaces/user.interface';
import { LoggerService } from '../logger/logger.service';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { SessionService } from '../session/session.service';


@Injectable()
export class UserService {
  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    @InjectModel('ForgotPassword')
    @InjectModel('Ticket')
    private readonly forgotPasswordModel: Model<ForgotPassword>,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private mailService: MailService,
    private readonly logger: LoggerService
  ) { }

  /***************
   * UPDATE USER *
   ***************/

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    await this.isEmailUnique(user.email);
    this.setRegistrationInfo(user);
    await user.save();
    return this.buildRegistrationInfo(user);
  }

  /****************
   * VERIFY EMAIL *
   ****************/

  async verifyEmail(req: Request, verification: string) {
    const user = await this.findByVerification(verification);
    await this.setUserAsVerified(user);
    return {
      fullName: user.fullName,
      email: user.email,
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),
    };
  }

  /*********
   * LOGIN *
   *********/
  async login(req: Request, loginUserDto: LoginUserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);
    this.isUserBlocked(user);
    await this.checkPassword(loginUserDto.password, user);
    await this.passwordsAreMatch(user);
    const birthday = new Date(user.birthday);
    this.logger.log(Date.now, 'UserService');

    var userLocation = await this.getLocationInfo(req);

    this.updateUserLocation({ userId: user.id.valueOf().toString(), userLocation: userLocation })
    return {
      fullName: user.fullName,
      email: user.email,
      age: this._calculateAge(birthday),
      roles: user.roles,
      birthday: this.formatDate(birthday.toString()),
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),

    };
  }

  /**************
   * SEND EMAIL *
   **************/

  async sendEmail(user) {
    return await this.mailService.sendUserConfirmation(user);
  }

  /*****************
   * _CALCULATEAGE *
   *****************/

  private _calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /*****************
   * REFRESH TOKEN *
   *****************/

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    // console.log('Acesss id hherer', refreshAccessTokenDto);
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken,
    );
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Bad request');
    }
    return {
      accessToken: await this.authService.createAccessToken(user._id),
    };
  }

  /*******************
   * FORGET PASSWORD *
   *******************/

  async forgotPassword(
    req: Request,
    createForgotPasswordDto: CreateForgotPasswordDto,
  ) {
    await this.findByEmail(createForgotPasswordDto.email);
    await this.saveForgotPassword(req, createForgotPasswordDto);
    return {
      email: createForgotPasswordDto.email,
      message: 'verification sent.',
    };
  }

  /*******************
   * FORGET PASSWORD VERIFY*
   *******************/

  async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto) {
    const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
    await this.setForgotPasswordFirstUsed(req, forgotPassword);
    return {
      email: forgotPassword.email,
      message: 'now reset your password.',
    };
  }

  /******************
   * RESET PASSWORD *
   ******************/

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const forgotPassword = await this.findForgotPasswordByEmail(
      resetPasswordDto,
    );
    await this.setForgotPasswordFinalUsed(forgotPassword);
    await this.resetUserPassword(resetPasswordDto);
    return {
      email: resetPasswordDto.email,
      message: 'password successfully changed.',
    };
  }

  /*****************************
   * GET TICKETS BY SESSION_ID *
   *****************************/

  async getUsersBySession(idSession: string): Promise<Array<User>> {
    let tickets = await this.ticketModel.find({
      idSession: { $eq: idSession },
      $and: [
        {
          $or: [{ idClient: { $exists: true } }, { idClient: { $ne: null } }],
        },
      ],
    });

    var idClients = [];
    for (var n = 1; n < tickets.length; ++n) {
      tickets.forEach((ticket) => {
        idClients.push(ticket.idClient);
      });
    }

    return await this.userModel.find({ _id: { $in: idClients } }, { idClient: 1, fullName: 1, email: 1, birthday: 1, userLocation: 1 });
  }

  /*********************
   * PROTECTED SERVICE *
   *********************/

  /******************
 * GET ALL users *
 ******************/

  async findAll(): Promise<Array<User>> {
    console.log('findAll called with ');
    return await this.userModel.find({}, { idClient: 1, fullName: 1, email: 1, birthday: 1, userLocation: 1 });
  }

  /*****************************
   * GET NUMBER OF USER BY DAY *
   *****************************/

  async getNumberOfRegistrationByDay(params): Promise<Array<User>> {
    console.log('params', params);
    let user;
    try {
      user = this.sessionService.getOneSession(params.idSession).then(async (session) => {

        return await this.userModel.aggregate(
          [
  
  
            {
              $group: {
  
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                "nomberOfRegitration": {
                  "$sum": {
                    "$cond": [
                      {
  
                        "$and": [
                          {
  
  
                            $gte: ["$createdAt", new Date(session.startDate)]
  
  
                          },
                          {
                            $lte: ["$createdAt", new Date(session.endDate)]
                          },
                        ]
  
  
                      },
                      1,
                      0
                    ]
                  }
                },
  
  
  
              }
            }
            /*  {
                $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                   nomberOfRegitration: {
                    $count: {}
                  }
        
                }
              }*/
          ]).sort({ _id: 1 });
      }
      )
    } catch (error) {
      throw new UnauthorizedException('Sorry the sesssionId is Wrong', error);
    }


    return user;

   






  }

  /************************
   * UPDATE USER LOCATION *
   ************************/

  async updateUserLocation(
    updateUserLocation: UpdateUserLocationDto
  ): Promise<User> {

    console.log(updateUserLocation);
    let user;
    try {
      user = await this.userModel.findOneAndUpdate({ _id: updateUserLocation.userId }, { userLocation: updateUserLocation?.userLocation })

      console.log("Updater");
      console.log(user);

      console.log("Updater");
    } catch (error) {
      throw new UnauthorizedException('Sorry the userId is Wrong', error);
    }

    return user;

  }

  /*******************
   * PRIVATE METHODS *
   *******************/

  /********************
   * IS EMAIL UNIQUE *
   ********************/

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email, verified: true });
    if (user) {
      throw new BadRequestException('Email most be unique.');
    }
  }

  /*************************
   * SET REGISTRATION INFO *
   *************************/

  private setRegistrationInfo(user): any {
    user.verification = v4();
    user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
  }

  /***************************
   * BUILD REGISTRATION INFO *
   ***************************/

  private buildRegistrationInfo(user): any {
    const userRegistrationInfo = {
      fullName: user.fullName,
      email: user.email,
      verified: user.verified,
    };

    this.sendEmail({
      email: user.email,
      name: user.fullName,
      token: user.verification,
    });


    this.logger.log('User creaded', 'UserService');
    return userRegistrationInfo;
  }

  private async findByVerification(verification: string): Promise<User> {
    const user = await this.userModel.findOne({
      verification,
      verified: false,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new BadRequestException('Bad request.');
    }
    return user;
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, verified: true });
    if (!user) {
      throw new NotFoundException('Email not found.');
    }
    return user;
  }

  private async setUserAsVerified(user) {
    user.verified = true;
    await user.save();
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, verified: true });
    //  const user = await this.userModel.findOne({email, verified: false});
    if (!user) {
      throw new NotFoundException('Wrong email or password.');
    }
    return user;
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
      await this.passwordsDoNotMatch(user);
      throw new NotFoundException('Wrong email or password.');
    }
    return match;
  }

  private isUserBlocked(user) {
    if (user.blockExpires > Date.now()) {
      throw new ConflictException('User has been blocked try later.');
    }
  }

  private async passwordsDoNotMatch(user) {
    user.loginAttempts += 1;
    await user.save();
    if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
      await this.blockUser(user);
      throw new ConflictException('User blocked.');
    }
  }

  private async blockUser(user) {
    user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
    await user.save();
  }

  private async passwordsAreMatch(user) {
    user.loginAttempts = 0;
    await user.save();
  }

  private async saveForgotPassword(
    req: Request,
    createForgotPasswordDto: CreateForgotPasswordDto,
  ) {
    const forgotPassword = await this.forgotPasswordModel.create({
      email: createForgotPasswordDto.email,
      verification: v4(),
      expires: addHours(new Date(), this.HOURS_TO_VERIFY),
      ip: this.authService.getIp(req),
      browser: this.authService.getBrowserInfo(req),
      country: this.authService.getCountry(req),
    });
    await forgotPassword.save();
  }

  private async findForgotPasswordByUuid(
    verifyUuidDto: VerifyUuidDto,
  ): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      verification: verifyUuidDto.verification,
      firstUsed: false,
      finalUsed: false,
      expires: { $gt: new Date() },
    });
    if (!forgotPassword) {
      throw new BadRequestException('Bad request.');
    }
    return forgotPassword;
  }

  private async setForgotPasswordFirstUsed(
    req: Request,
    forgotPassword: ForgotPassword,
  ) {
    forgotPassword.firstUsed = true;
    forgotPassword.ipChanged = this.authService.getIp(req);
    forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
    forgotPassword.countryChanged = this.authService.getCountry(req);
    await forgotPassword.save();
  }

  private async findForgotPasswordByEmail(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      email: resetPasswordDto.email,
      firstUsed: true,
      finalUsed: false,
      expires: { $gt: new Date() },
    });
    if (!forgotPassword) {
      throw new BadRequestException('Bad request.');
    }
    return forgotPassword;
  }

  private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
    forgotPassword.finalUsed = true;
    await forgotPassword.save();
  }

  private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
      verified: true,
    });
    user.password = resetPasswordDto.password;
    await user.save();
  }

  private formatDate(date: string) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('/');
  }


  async getLocationInfo(req: Request): Promise<Object> {
    let ip = await getClientIp(req);

    const ipinfo = new IPinfoWrapper('cec88b6b1d6573');
    return ipinfo.lookupIp(ip);
  }

}

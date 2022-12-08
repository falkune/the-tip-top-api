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
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { addHours } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { ForgotPassword } from './interfaces/forgot-password.interface';
import { Ticket } from '../ticket/interfaces/ticket.interface';
import { User } from './interfaces/user.interface';
import { LoggerService } from '../logger/logger.service';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { SessionService } from '../session/session.service';
import { LoginCreateSocialUser } from './dto/login-create-social.dto';
import { UrlGeneratorService } from 'nestjs-url-generator/dist/url-generator.service';
import { EmailQuery } from './query/email.query';
import { UserController } from './user.controller';



@Injectable()
export class UserService {
  HOURS_TO_VERIFY = 4;
  HOURS_TO_BLOCK = 6;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private mailService: MailService,
    private readonly logger: LoggerService,
    private readonly urlGeneratorService: UrlGeneratorService
  ) { }



  /***************
   * UPDATE USER *
   ***************/

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    await this.isEmailUnique(user.email);
    this.setRegistrationInfo(user);
    await user.save();
    return user;

  }


  /*****************************
   * UPDATE USER  FROM NETWORK *
   *****************************/

  async createSocialNetworkUser(loginCreateSocialUser: LoginCreateSocialUser): Promise<User> {
    const user = new this.userModel(loginCreateSocialUser);

    await this.isEmailUnique(user.email);
    this.setRegistrationInfo(user);
    await user.save();
    return user;
  }

  /****************
   * VERIFY EMAIL *
   ****************/

  async verifyEmail(verification: string) {
    console.log(verification);
    const user = await this.findByVerification(verification);
    if (user && user.fullName) {
      await this.setUserAsVerified(user);
    }
    return {
      fullName: user.fullName,
      email: user.email
    };
  }


  /**********
   * LOGOUT *
   **********/

  async logout(req: Request, logoutDto: RefreshAccessTokenDto) {


    return this.authService.logout(logoutDto.refreshToken);

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

    let userLocation = await this.getLocationInfo(req);


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


  /*******************************************
   * * LOGIN OR CREATE FROM SOCIAL NETWORK * *
   *******************************************/

  async findOrCreate(req: Request, loginCreateSocialUser: LoginCreateSocialUser) {

    const user = await this.findUserSocialNetworkUser(loginCreateSocialUser);
    this.isUserBlocked(user);
    const birthday = new Date(user.birthday);
    let userLocation = await this.getLocationInfo(req);

    this.updateUserLocation({ userId: user.id.valueOf().toString(), userLocation: userLocation });

    return {
      fullName: user.fullName,
      email: user.email,
      age: this._calculateAge(birthday),
      roles: user.roles,
      birthday: this.formatDate(birthday.toString()),
      accessToken: await this.authService.createAccessToken(user._id),
      refreshToken: await this.authService.createRefreshToken(req, user._id),

      /**/
    };


  }



  /**************
   * SEND EMAIL *
   **************/

  async sendEmail(user) {
    return await this.mailService.sendUserConfirmation(user);
  }

  /****************************
  * SEND EMAIL CONFIRMATIONS *
  ****************************/

  async sendUserConfirmation(user) {

    return await this.mailService.sendUserConfirmation(user);
  }




  /********************************
   * * SEND EMAIL CONFIRMATIONS * *
   ********************************/

  // async sendForgotPasswordVerifier(forgotPassword) {

  //   return await this.mailService.sendForgotPasswordVerifier(forgotPassword);
  // }


  /*****************
   * _CALCULATEAGE *
   *****************/

  private _calculateAge(birthday) {
    // birthday is a date
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /*****************
   * REFRESH TOKEN *
   *****************/

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken,
    );
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Bad request');
    }
    return {
      accessToken: await this.authService.createAccessToken(user._id),
      message: 'Vous êtes reconnecté !'
    };
  }

  /*******************
   * FORGET PASSWORD *
   *******************/

  async forgotPassword(
    req: Request,
    createForgotPasswordDto: CreateForgotPasswordDto,
  ) {
    let user = await this.findByEmail(createForgotPasswordDto.email);
    let forgotPassword = await this.saveForgotPassword(req, createForgotPasswordDto);
    let url = await this.generateVerifyForgotPasswordUrl(forgotPassword);
    await this.mailService.sendForgotPasswordVerifier({ name: user.fullName, email: user.email, url: url }); 

    return {
      email: createForgotPasswordDto.email,
      message: 'Un email de vérification de votre demande vous a été envoyé à l\'addresse email indiqué. ',
      url: url
    };
  }

  /*************************
   * FORGET PASSWORD VERIFY*
   *************************/

  async forgotPasswordVerify(req: Request, verification: string) {
    const forgotPassword = await this.findForgotPasswordByUuid(verification);

    if (forgotPassword && forgotPassword.email) {
      await this.setForgotPasswordFirstUsed(req, forgotPassword);
      return {
        email: forgotPassword.email,
        message: 'now reset your password.',
      };
    } else {
      return {
        message: 'Le lien a expiré',
      };
    }
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

    let idClients = [];
    for (let n = 1; n < tickets.length; ++n) {
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

    return await this.userModel.find({}, { idClient: 1, fullName: 1, email: 1, birthday: 1, userLocation: 1 });
  }

  /*****************************
   * GET NUMBER OF USER BY DAY *
   *****************************/

  async getNumberOfRegistrationByDay(params): Promise<Array<User>> {

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
          ]).sort({ _id: 1 });
      }
      )
    } catch (error) {
      throw new NotAcceptableException('Sorry the sesssionId is Wrong', error);
    }


    return user;








  }

  /************************
   * UPDATE USER LOCATION *
   ************************/

  async updateUserLocation(
    updateUserLocation: UpdateUserLocationDto
  ): Promise<User> {


    let user;
    try {
      user = await this.userModel.findOneAndUpdate({ _id: updateUserLocation.userId }, { userLocation: updateUserLocation?.userLocation })





    } catch (error) {
      throw new NotAcceptableException('Sorry the userId is Wrong', error);
    }

    return user;

  }

  /***************************
 * BUILD REGISTRATION INFO *
 ***************************/


  buildRegistrationInfo(info): any {


    this.sendUserConfirmation(info);

    return info;

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



  private async findByVerification(verification: string): Promise<User> {
    const user = await this.userModel.findOne({
      verification,
      verified: false,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) {
      return new this.userModel();

    } else {
      return user;
    }

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
    if (!user) {
      throw new NotFoundException('Wrong email or password.');
    }
    return user;
  }


  private async findUserSocialNetworkUser(loginCreateSocialUser: LoginCreateSocialUser): Promise<User> {
    const user = await this.userModel.findOne({ email: loginCreateSocialUser.email });



    if (!user) {

      let userCreated = await this.createSocialNetworkUser(loginCreateSocialUser)
      this.mailService.sendWelcomeEmail({
        email: userCreated.email,
        name: userCreated.fullName,
        url: "https://dev.dsp-archiwebo21-ct-df-an-cd.fr/",
      });
      return userCreated;
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
    return await forgotPassword.save();
  }

  private async findForgotPasswordByUuid(
    verification: string,
  ): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      verification: verification,
      firstUsed: false,
      finalUsed: false,
      expires: { $gt: new Date() },
    });
    if (!forgotPassword) {
      return {} as ForgotPassword;
    } else { return forgotPassword; }

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
      return {} as ForgotPassword;
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
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('/');
  }


  /****************************************
   * GENERATE VERIFY FORGOT PASSWORD URL *
   ****************************************/


  private generateVerifyForgotPasswordUrl(forgotPassword: ForgotPassword) {
    const emailParams = {
      version: '1.0//.%$',
      userId: 'true',
    };

    const query: EmailQuery = {
      verification: forgotPassword.verification,
    };

    const urlGenerator = this.urlGeneratorService.signControllerUrl({
      controller: UserController,
      controllerMethod: UserController.prototype.forgotPasswordVerify,
      expirationDate: forgotPassword.expires,
      query: query,
      params: emailParams,
    });
    return urlGenerator;
  }

  async getLocationInfo(req: Request): Promise<Object> {
    let ip = await getClientIp(req);

    const ipinfo = new IPinfoWrapper('cec88b6b1d6573');
    return ipinfo.lookupIp(ip);
  }


  googleLogin(req: Request, loginCreateSocialUser: LoginCreateSocialUser) {


    if (!req.user) {
      return 'No user from social network';
    }

    return this.findOrCreate(req, loginCreateSocialUser);
  }

}

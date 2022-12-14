import { Roles } from './../auth/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { SignedUrlGuard, UrlGeneratorService } from 'nestjs-url-generator';
import { LocalAuthGuard } from '../auth/guards/auth.guard'
import { EmailParams } from '../user/params/email.params';
import { EmailQuery } from '../user/query/email.query';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetTicketBySessionDto } from '../ticket/dto/get-tickets-by-session.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginCreateSocialUser } from './dto/login-create-social.dto';
import { User } from './interfaces/user.interface';
import { MailService } from 'src/mail/mail.service';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private maileService: MailerService, private mailService: MailService, private readonly urlGeneratorService: UrlGeneratorService) { }









  // ╔═╗╦ ╦╔╦╗╦ ╦╔═╗╔╗╔╔╦╗╦╔═╗╔═╗╔╦╗╔═╗
  // ╠═╣║ ║ ║ ╠═╣║╣ ║║║ ║ ║║  ╠═╣ ║ ║╣
  // ╩ ╩╚═╝ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╩╚═╝╩ ╩ ╩ ╚═╝

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({})
  async register(@Body() createUserDto: CreateUserDto) {

    let user = await this.userService.create(createUserDto);

    const urlGenerator = this.generateUrl(user);
    // return urlGenerator;

    let sendEmail = await this.mailService.sendUserConfirmation({
      email: user.email,
      name: user.fullName,
      url: urlGenerator,
    });
    console.log(sendEmail)
    if(sendEmail){
      return {"message": "un mail de confirmation vous a ete envoye"}
    }
  }
  

  private generateUrl(user: User) {
    const emailParams = {
      version: '1.0//.%$',
      userId: 'true',
    };

    const query: EmailQuery = {
      verification: user.verification,
    };

    const urlGenerator = this.urlGeneratorService.signControllerUrl({
      controller: UserController,
      controllerMethod: UserController.prototype.verifyEmail,
      expirationDate: user.verificationExpires,
      query: query,
      params: emailParams,
    });
    return urlGenerator;
  }

  /**************************************************
   * LOGIN OR USER USING DATA PROVIDED FROM SOCIALS *
   **************************************************/


  @Post('auth-from-social-network')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or User using data provided from socials' })
  @ApiOkResponse({})
  async authFromSocialNetwork(@Req() req: Request, @Body() LoginCreateSocialUser: LoginCreateSocialUser) {
    return await this.userService.findOrCreate(req, LoginCreateSocialUser);

  }



  /************************
   * VERIFY EMAIL ADDRESS *
   ************************/

  @Get('make-signed-url/version/:version/user/:userId')
  @UseGuards(SignedUrlGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Email' })
  @ApiOkResponse({})
  async verifyEmail(@Param() emailParams: EmailParams,
    @Query() emailQuery: EmailQuery, @Res() res: Response) {
    let verify = await this.userService.verifyEmail(emailQuery.verification);
    
    return res.render('requestVerifyEmail', {
      layout: 'layout_main',
      message: { isExpired: !verify.fullName, text: verify.fullName, url: process.env.FRONT_END_URL },
    });

  }




    @Post('createFakUsers')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'createFakUsers' })
  @ApiCreatedResponse({})
  async createFakUsers() {

   return  await this.userService.createFakUsers();

    
  }




  /*******************
   * LOGIN CLASSIQUE *
   *******************/

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({})
  async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {


    return await this.userService.login(req, loginUserDto);
  }



  /**********
   * LOGOUT *
   **********/

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'LoOut User' })
  @ApiOkResponse({})
  async logout(@Req() req: Request, @Body() refreshAccessToken: RefreshAccessTokenDto) {


    return await this.userService.logout(req, refreshAccessToken);
  }


  /************************
   * REFRESH-ACCESS-TOKEN *
   ************************/

  @Post('refresh-access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Refresh Access Token with refresh token' })
  @ApiCreatedResponse({})
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }
  /********************
   * FORGOT-PASSWORD' *
   ********************/

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({})
  async forgotPassword(
    @Req() req: Request,
    @Body() createForgotPasswordDto: CreateForgotPasswordDto,
  ) {
    return await this.userService.forgotPassword(req, createForgotPasswordDto);

  }




  /**************************
   * FORGOT-PASSWORD-VERIFY *
   **************************/


  @Get('forgot-password-verify/version/:version/user/:userId')
  @UseGuards(SignedUrlGuard) 
  async forgotPasswordVerify(@Param() emailParams: EmailParams,
    @Query() emailQuery: EmailQuery, @Res() res: Response, @Req() req: Request) {
    let verify = await this.userService.forgotPasswordVerify(req, emailQuery.verification);
    
    return res.render('requestVerifyForgetPassword', {
      layout: 'layout_main',
      message: { isExpired: !verify.email, text: verify.email, url: process.env.FRONT_END_URL },
    });

  }


  /***************************
   *     RESET-PASSWORD      * 
   ***************************/

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password after verify reset password' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }


  /********************
   * USERS-BY-SESSION *
   ********************/

  @Post('users-by-session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users by sessionId ' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getTicketBySession(
    @Body() getTicketBySessionDto: GetTicketBySessionDto,
  ) {


    return await this.userService.getUsersBySession(
      getTicketBySessionDto.idSession,
    );
  }

  @Get('registration-by-day/:idSession')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Get number of registration by day ' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiParam({ name: 'id', description: 'id of the session' })
  @ApiOkResponse({})
  async getNumberOfRegistrationByDay(@Param() params) {


    return await this.userService.getNumberOfRegistrationByDay(params);
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users by sessionId ' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  findAll() {
    return this.userService.findAll();
  }


  async getOneUser  (id: string) {
    return await this.userService.getOneUser(id);

  }


  // @Get("/facebook")
  // @UseGuards(AuthGuard("facebook"))
  // async facebookLogin(): Promise<any> {
  //   return HttpStatus.OK;
  // }

  // @Get("/facebook/redirect")
  // @UseGuards(AuthGuard("facebook"))
  // async facebookLoginRedirect(@Req() req): Promise<any> {
  //   return this.userService.googleLogin(req, req.user)
  // }

  // @Get("/google")
  // @UseGuards(AuthGuard("google"))
  // async googleAuth(@Req() req) { }


  // @Get('/google/redirect')

  // @UseGuards(AuthGuard("google"))
  // googleAuthRedirect(@Req() req) {
  //   return this.userService.googleLogin(req, req.user)
  // }








}

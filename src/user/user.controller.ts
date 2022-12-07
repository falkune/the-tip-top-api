import { Roles } from './../auth/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
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
  Redirect,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
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

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private mailService: MailerService) { }

  // ╔═╗╦ ╦╔╦╗╦ ╦╔═╗╔╗╔╔╦╗╦╔═╗╔═╗╔╦╗╔═╗
  // ╠═╣║ ║ ║ ╠═╣║╣ ║║║ ║ ║║  ╠═╣ ║ ║╣
  // ╩ ╩╚═╝ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╩╚═╝╩ ╩ ╩ ╚═╝
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({})
  async register(@Body() createUserDto: CreateUserDto,@Res() res: Response) {

     return await this.userService.create(createUserDto);
  

    /*return res.render('requestVerifyEmail', {
      layout: 'layout_main',
     message: {IsFriend:false,text:user.email},
    });*/
   
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Email' })
  @ApiOkResponse({})

  async verifyEmail(@Req() req: Request, @Query('verification') verification) {
    return await this.userService.verifyEmail(req, verification);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({})
  async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {


    return await this.userService.login(req, loginUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'LoOut User' })
  @ApiOkResponse({})
  async logout(@Req() req: Request, @Body() refreshAccessToken: RefreshAccessTokenDto) {


    return await this.userService.logout(req, refreshAccessToken);
  }



  @Post('refresh-access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Refresh Access Token with refresh token' })
  @ApiCreatedResponse({})
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

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

  @Get('forgot-password-verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verfiy forget password code' })
  @ApiOkResponse({})
  async forgotPasswordVerify(
    @Req() req: Request,

    @Query('verification') verification
  ) {
    return await this.userService.forgotPasswordVerify(req, verification);
  }

  @Post('reset-password')
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

    console.log("getTicketBySessionDto.description");
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

    console.log("getNumberOfRegistrationByDay.getNumberOfRegistrationByDay", params);
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


  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req): Promise<any> {
    return this.userService.googleLogin(req, req.user)
  }

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) { }


  @Get('/google/redirect')

  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req, req.user)
  }



  @Post('auth-from-social-network')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or User using data provided from socials' })
  @ApiOkResponse({})
  async authFromSocialNetwork(@Req() req: Request, @Body() LoginCreateSocialUser: LoginCreateSocialUser) {
    return await this.userService.findOrCreate(req, LoginCreateSocialUser);
  }
 

  @Get('layout')
  anotherLayout(@Res() res: Response) {
    return res.render('requestVerifyEmail', {
      layout: 'layout_main',
      message: {IsFriend:false,text:"This is my fiend"},
    });
  }

 


}

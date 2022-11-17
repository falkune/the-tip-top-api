import { Roles } from './../auth/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { Request } from 'express';
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

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService,private mailService: MailerService) {}

  // ╔═╗╦ ╦╔╦╗╦ ╦╔═╗╔╗╔╔╦╗╦╔═╗╔═╗╔╦╗╔═╗
  // ╠═╣║ ║ ║ ╠═╣║╣ ║║║ ║ ║║  ╠═╣ ║ ║╣
  // ╩ ╩╚═╝ ╩ ╩ ╩╚═╝╝╚╝ ╩ ╩╚═╝╩ ╩ ╩ ╚═╝
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user' })
  @ApiCreatedResponse({})
  async register(@Body() createUserDto: CreateUserDto) {
  
    let user = await this.userService.create(createUserDto);
    
    return user;
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Email' })
  @ApiOkResponse({})
 
  async verifyEmail(@Req() req: Request,  @Query('verification') verification) {
    return await this.userService.verifyEmail(req, verification);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({})
  async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
    

    return await this.userService.login(req, loginUserDto);
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

  @Post('forgot-password-verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verfiy forget password code' })
  @ApiOkResponse({})
  async forgotPasswordVerify(
    @Req() req: Request,
    @Body() verifyUuidDto: VerifyUuidDto,
  ) {
    return await this.userService.forgotPasswordVerify(req, verifyUuidDto);
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
  @ApiParam({ name: 'id', description: 'id of the sesssion' })
  @ApiOkResponse({})
  async getNumberOfRegistrationByDay(@Param() params) {

    console.log("getNumberOfRegistrationByDay.getNumberOfRegistrationByDay",params);
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
}

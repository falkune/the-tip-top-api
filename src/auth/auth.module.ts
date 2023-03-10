import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { RefreshTokenSchema } from './schemas/refresh-token.schema'; 
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
    ]),
    PassportModule,MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }) 
  ],
  providers: [AuthService, JwtStrategy,LoggerService],
  exports: [AuthService],
})
export class AuthModule {}

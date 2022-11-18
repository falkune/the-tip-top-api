import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { ForgotPasswordSchema } from './schemas/forgot-password.schema';
import { TicketSchema } from '../ticket/schemas/ticket.schema';
import { TicketModule } from '../ticket/ticket.module';
import { MailModule } from '../mail/mail.module';
import { LoggerService } from '../logger/logger.service';
import { SessionSchema } from '../session/schemas/session.schema';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/session.service'; 
import { OurConfigService } from '../mail/config.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'ForgotPassword', schema: ForgotPasswordSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    TicketModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema}]),SessionModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService,LoggerService,SessionService,OurConfigService],
})
export class UserModule {}

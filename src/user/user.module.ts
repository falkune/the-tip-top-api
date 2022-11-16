import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { ForgotPasswordSchema } from './schemas/forgot-password.schema';
import { TicketSchema } from '../ticket/schemas/ticket.schema';
import { TicketModule } from '../ticket/ticket.module';
import { MailModule } from 'src/mail/mail.module';
import { LoggerService } from 'src/logger/logger.service';
import { SessionSchema } from 'src/session/schemas/session.schema';
import { SessionModule } from 'src/session/session.module';
import { SessionService } from 'src/session/session.service';

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
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService,LoggerService,SessionService],
})
export class UserModule {}

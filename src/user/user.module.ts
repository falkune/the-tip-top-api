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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'ForgotPassword', schema: ForgotPasswordSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    TicketModule,
    AuthModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './schemas/ticket.schema';
import { GroupSchema } from '../group/schemas/group.schema';
import { GroupService } from '../group/group.service';
import { GroupModule } from '../group/group.module';
import { SessionSchema } from '../session/schemas/session.schema';
import { SessionModule } from '../session/session.module';
import { SessionService } from '../session/session.service';
import { LoggerService } from '../logger/logger.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/schemas/user.schema';
import { ForgotPasswordSchema } from 'src/user/schemas/forgot-password.schema';



@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Ticket', schema: TicketSchema}]),
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema}]),GroupModule,
    MongooseModule.forFeature([{ name: 'ForgotPassword', schema: ForgotPasswordSchema}]), 
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema}]),SessionModule,AuthModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),forwardRef(() => UserModule)
  ],
  controllers: [TicketController],
  providers: [TicketService,GroupService,SessionService,LoggerService,UserService] 
})
export class TicketModule {}

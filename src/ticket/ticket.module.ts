import { Module } from '@nestjs/common';
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



@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Ticket', schema: TicketSchema}]),
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema}]),GroupModule,
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema}]),SessionModule,AuthModule
  ],
  controllers: [TicketController],
  providers: [TicketService,GroupService,SessionService,LoggerService]
})
export class TicketModule {}

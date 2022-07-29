import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './schemas/ticket.schema';
import { GroupSchema } from 'src/group/schemas/group.schema';
import { GroupService } from 'src/group/group.service';
import { GroupModule } from 'src/group/group.module';
import { SessionSchema } from 'src/session/schemas/session.schema';
import { SessionModule } from 'src/session/session.module';
import { SessionService } from 'src/session/session.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Ticket', schema: TicketSchema}]),
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema}]),GroupModule,
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema}]),SessionModule,AuthModule
  ],
  controllers: [TicketController],
  providers: [TicketService,GroupService,SessionService]
})
export class TicketModule {}

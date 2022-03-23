import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './schemas/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Ticket', schema: TicketSchema}]),
  ],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {}

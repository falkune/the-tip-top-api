import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
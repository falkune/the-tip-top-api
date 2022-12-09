import { Document } from 'mongoose';

export interface Ticket extends Document {
   
    idClient: number,
    ticketNumber: string,
    idGroup: string,
    idSession: string,
    isDelivered: boolean,
    createdAt: Date,
    updatedAt: Date
};
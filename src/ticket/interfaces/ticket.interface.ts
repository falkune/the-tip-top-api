import { Document } from 'mongoose';

export interface Ticket extends Document {
    // title: string,
    // body: string,
    idClient: number,
    ticketNumber: String,
    idGroup: string,
    idSession: string
};
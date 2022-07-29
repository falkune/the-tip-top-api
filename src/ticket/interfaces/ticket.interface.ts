import { Document } from 'mongoose';

export interface Ticket extends Document {
    title: string,
    body: string,
    idClient: number,
    ticketNumber: number,
    idGroup: string,
    idSession: string
};
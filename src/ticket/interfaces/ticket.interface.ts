import { Document } from 'mongoose';

export interface Ticket extends Document {
    title: string,
    body: string,
};
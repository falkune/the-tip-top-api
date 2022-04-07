import { Document } from 'mongoose';

export interface Ticket extends Document {
    title: string,
    body: string,
    id_client: number
};
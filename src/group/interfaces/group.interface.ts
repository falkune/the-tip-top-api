import { Document } from 'mongoose';

export interface Group extends Document {
    description: string,
    percentage: number,
    limitTicket: number 
};
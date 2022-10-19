import { Document } from 'mongoose';

export interface Session extends Document {
    startDate: string,
    endDate: string,
    name: string,
    description: string,
    limitTicket: number,
    isCurrent: boolean,
};
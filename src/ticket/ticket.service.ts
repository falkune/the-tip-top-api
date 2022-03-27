import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket } from './interfaces/ticket.interface';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
    constructor(
        @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    ) { }

    // ┌─┐┬─┐┌─┐┌─┐┌┬┐┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐
    // │  ├┬┘├┤ ├─┤ │ ├┤   ├─┤├┬┘ │ ││  │  ├┤ 
    // └─┘┴└─└─┘┴ ┴ ┴ └─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘

    async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
        const ticket = new this.ticketModel(createTicketDto);
        await ticket.save();
        return ticket;
    }

    // ┌─┐┌─┐┌┬┐  ┌─┐┬  ┬    ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐┌─┐
    // │ ┬├┤  │   ├─┤│  │    ├─┤├┬┘ │ ││  │  ├┤ └─┐
    // └─┘└─┘ ┴   ┴ ┴┴─┘┴─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘└─┘
    async getAllTickets(): Promise<any> {
        return await this.ticketModel.find({});
    }

    // ┌─┐┌─┐┌┬┐  ┌─┐┌┐┌┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐
    // │ ┬├┤  │   │ ││││├┤   ├─┤├┬┘ │ ││  │  ├┤ 
    // └─┘└─┘ ┴   └─┘┘└┘└─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘
    async getOneTicket(id: string): Promise<Ticket> {
        return await this.ticketModel.findById(id);
    }

    // ┬ ┬┌─┐┌┬┐┌─┐┌┬┐┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐    ┌─┐┬  ┬    ┌─┐┌─┐┬─┐┌─┐┌┬┐┌─┐  
    // │ │├─┘ ││├─┤ │ ├┤   ├─┤├┬┘ │ ││  │  ├┤     ├─┤│  │    ├─┘├─┤├┬┘├─┤│││└─┐  
    // └─┘┴  ─┴┘┴ ┴ ┴ └─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘    ┴ ┴┴─┘┴─┘  ┴  ┴ ┴┴└─┴ ┴┴ ┴└─┘  \
    async updateTicketPut(id: string, createTicketDto: CreateTicketDto): Promise<Ticket> {
        return await this.ticketModel.updateOne({_id: id}, createTicketDto);
    }

    // ┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐  ┌─┐┌┐┌┌─┐  ┌─┐┬─┐┌┬┐┬┌─┐┬  ┌─┐
    //  ││├┤ │  ├┤  │ ├┤   │ ││││├┤   ├─┤├┬┘ │ ││  │  ├┤ 
    // ─┴┘└─┘┴─┘└─┘ ┴ └─┘  └─┘┘└┘└─┘  ┴ ┴┴└─ ┴ ┴└─┘┴─┘└─┘
    async deleteTicket(id: string): Promise<Ticket> {
        return await this.ticketModel.findByIdAndDelete(id);
    }
}

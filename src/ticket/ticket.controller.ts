import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiUseTags,
    ApiBearerAuth,
    ApiImplicitHeader,
    ApiOperation,
    ApiImplicitParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiUseTags('Ticket')
@Controller('ticket')
@UseGuards(RolesGuard)
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get All ticket',})
    @ApiOkResponse({})
    async getAllTicket() {
        return await this.ticketService.getAllTickets();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Get One ticket',})
    @ApiImplicitParam({name: 'id', description: 'id of ticket'})
    @ApiOkResponse({})
    async getOneTickets(@Param() params) {
        return await this.ticketService.getOneTicket(params.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({title: 'Create one ticket',})
    @ApiBearerAuth()
    @ApiImplicitHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiCreatedResponse({})
    async createTicket(@Body() createTicketDto: CreateTicketDto) {
        return await this.ticketService.createTicket(createTicketDto);
    }


    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({title: 'Update one ticket by id ( all params )',})
    @ApiBearerAuth()
    @ApiImplicitParam({name: 'id', description: 'id of ticket'})
    @ApiImplicitHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiOkResponse({})
    async updateWithAllParams(@Param() params, @Body() createTicketDto: CreateTicketDto) {
        return await this.ticketService.updateTicketPut(params.id, createTicketDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @ApiOperation({title: 'Delete one ticket',})
    @ApiBearerAuth()
    @ApiImplicitHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    @ApiImplicitParam({name: 'id', description: 'id of ticket we want to delete.'})
    @ApiOkResponse({})
    async deleteOneTicket(@Param() params) {
        return await this.ticketService.deleteTicket(params.id);
    }
}

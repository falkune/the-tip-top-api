import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  Headers,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { VerifyTicketDto } from './dto/verify-ticket.dto';
import { GetTicketBySessionDto } from './dto/get-tickets-by-session.dto';
import { GetTicketByClientDto } from './dto/get-tickets-by-client.dto';
import { GroupService } from '../group/group.service';
import { DeliverTicketByAdminDto } from './dto/deliver-ticket-by-admin.dto';
import { DeliverTicketByClientDto } from './dto/deliver-ticket-by-client.dto';




@ApiTags('Ticket')
@Controller('ticket')
@UseGuards(RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService, private readonly groupeService: GroupService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All ticket' })
  @ApiOkResponse({})
  async getAllTicket() {
    return await this.ticketService.getAllTickets();
  }

  /************************
   * GET TICKET STATISTICS *
   ************************/

  @Get("get-ticket-stats/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tickets and statics by sessionId' })
  @ApiParam({ name: 'id', description: 'id of the sesssion' })
  @ApiOkResponse({})
  async getTicketStats(@Param() params) {
    return await this.ticketService.getTicketStats(params.id);
  }



  /*********
   * BINGO *
   *********/

  @Get("/bingo/:id")
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the final winner' })
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiBearerAuth()
  async binngo(@Param() params) {
    return await this.ticketService.bingo(params.id);
  }





  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get One ticket' })
  @ApiParam({ name: 'id', description: 'id of ticket' })
  @ApiOkResponse({})
  async getOneTickets(@Param() params) {
    return await this.ticketService.getOneTicket(params.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Create one ticket' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiCreatedResponse({})
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.createTicket(createTicketDto);
  }




  @Post("thetiptop-generate-total-tickets")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
 // @ApiOperation({ summary: 'Generate All tickets for a session' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiCreatedResponse({})
  async generateTickets(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.generateTickets(createTicketDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'id of ticket' })
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async updateWithAllParams(
    @Param() params,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    return await this.ticketService.updateTicketPut(params.id, createTicketDto);
  }

  @Patch('assign-ticket')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('client', 'admin')
  @ApiOperation({ summary: 'Update one ticket by id ( client id )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async assignTicket(
    @Headers() headers,
    @Body() assignTicketDto: AssignTicketDto,
  ) {

    return await this.ticketService.assignTicket(
      assignTicketDto?.idClient,
      assignTicketDto,
    );
  }

  @Patch('deliver-ticket')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('client', 'admin')
  @ApiOperation({ summary: 'Update one ticket by id ( client id and ticket number )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async deliverTicket(
    @Headers() headers,
    @Body() deliverTicketByClientDto: DeliverTicketByClientDto,
  ) {

    return await this.ticketService.deliverTicket(
      deliverTicketByClientDto?.idClient,
      deliverTicketByClientDto,
    );
  }

  @Patch('deliver-ticket-by-admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('client', 'admin')
  @ApiOperation({ summary: 'Update one ticket by id ( client id and ticket number )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async deliverTicketByAdmin(
    @Headers() headers,
    @Body() deliverTicketByAdminDto: DeliverTicketByAdminDto,
  ) {

    return await this.ticketService.deliverTicketByAdmin(
      deliverTicketByAdminDto
    );
  }

  @Post('/verify-ticket')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('client', 'admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async verifyTicket(@Body() verifyTicketDto: VerifyTicketDto) {


    return await this.ticketService.verifyTicket(verifyTicketDto?.ticketNumber);
  }

  @Post('/check-ticket')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'check ticket by ticket number' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async checkTicket(@Body() verifyTicketDto: VerifyTicketDto) {


    return await this.ticketService.checkTicket(verifyTicketDto?.ticketNumber);
  }

  @Post('/claimbed-tickets')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getClaimbedTickets() {
    return await this.ticketService.getClaimbedTickets();
  }



  @Post('/not-claimbed-tickets')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getNotClaimedTickets() {
    return await this.ticketService.getNotClaimedTickets();
  }
  @Post('/tickets-by-session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getTicketBySession(
    @Body() getTicketBySessionDto: GetTicketBySessionDto,
  ) {


    return await this.ticketService.getTicketBySession(
      getTicketBySessionDto.idSession,
    );
  }

  @Post('tickets-by-client')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('client', 'admin')
  @ApiOperation({ summary: 'Get ticket by clientId FOR USER' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getTicketByIdClient(
    @Body() getTicketByClientDto: GetTicketByClientDto,
  ) {


    return await this.ticketService.getTicketByIdClient(
      getTicketByClientDto.idClient
    );
  }





  @Post('history-client')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Get ticket by clientId FOR ADMIN' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getHistoryClient(
    @Body() getTicketByClientDto: GetTicketByClientDto,
  ) {


    return await this.ticketService.getHistoryClient(
      getTicketByClientDto.idClient
    );
  }





  @Post('/claimbed-tickets-by-session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getClaimbedTicketsBySession(
    @Body() getTicketBySessionDto: GetTicketBySessionDto,
  ) {

    return await this.ticketService.getClaimbedTicketsBySession(
      getTicketBySessionDto.idSession,
    );
  }

  @Post('/tickets-not-claimbed-by-session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Update one ticket by id ( all params )' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiOkResponse({})
  async getNotClaimbedTicketsBySession(
    @Body() getTicketBySessionDto: GetTicketBySessionDto,
  ) {


    return await this.ticketService.getNotClaimbedTicketsBySession(
      getTicketBySessionDto.idSession,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiOperation({ summary: 'Delete one ticket' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for auth.',
  })
  @ApiParam({ name: 'id', description: 'id of ticket we want to delete.' })
  @ApiOkResponse({})
  async deleteOneTicket(@Param() params) {
    return await this.ticketService.deleteTicket(params.id);
  }
}

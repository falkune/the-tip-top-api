import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket } from './interfaces/ticket.interface';
import { GroupService } from '../group/group.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { AuthService } from 'src/auth/auth.service';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private readonly groupService: GroupService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  /*****************
   * CREATE TICKET *
   *****************/

  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const numberOfCreatedTickets = await this.getNumberOfCreatedTickets();
    const maxTicketForSession = await this.getMaxTicketFoSession(
      createTicketDto?.idSession,
    );

    if (numberOfCreatedTickets < maxTicketForSession) {
      createTicketDto.ticketNumber = this.getRandomInt();

      // console.log(maxTicketForSession, 'Maximum number for session');
      // console.log(numberOfCreatedTickets, 'Number of created tickets');
      let ticketFound = await this.getTicketByNumber(
        createTicketDto.ticketNumber,
      );
      let randGroup = await this.getRandomGroup();

      // console.log(randGroup, 'Le rendom');
      var trying = maxTicketForSession;

      // console.log(createTicketDto.ticketNumber);
      createTicketDto.idGroup = randGroup;
      while (
        ticketFound?.ticketNumber?.toString() ==
          createTicketDto?.ticketNumber?.toString() &&
        trying > 0
      ) {
        createTicketDto.ticketNumber = this.getRandomInt();
        ticketFound = await this.getTicketByNumber(
          createTicketDto.ticketNumber,
        );
        trying--;
        // console.log(trying, 'Essai');
      }

      if (trying == 0) {
        throw new ServiceUnavailableException('Limit of numbers exceeded');
      } else {
        // console.log('Savaing ...');

        const ticket = new this.ticketModel(createTicketDto);
        await ticket.save();
        return ticket;
      }
    } else {
      throw new ServiceUnavailableException('Limit of tickets atempted');
    }
  }

  /******************
   * GET ALL TICKET *
   ******************/

  async getAllTickets(): Promise<any> {
    return await this.ticketModel.find({});
  }

  /******************
   * GET ONE TICKET *
   ******************/

  async getOneTicket(id: string): Promise<Ticket> {
    return await this.ticketModel.findById(id);
  }

  /***************************
   * GET TICKET WHITH PARAMS *
   ***************************/

  async getTicketByNumber(ticketNumber: String): Promise<Ticket> {
    return await this.ticketModel.findOne({ ticketNumber: ticketNumber });
  }

  /*************************
   * GET TICKET BY GROUPID *
   *************************/

  async getAllTicketForGroup(idGroup: string): Promise<number> {
    return await this.ticketModel.find({ idGroup: { $eq: idGroup } }).count();
  }

  /***************************************
   * COUNT THE NUMBER OF CREATED TICKETS *
   ***************************************/

  async getNumberOfCreatedTickets(): Promise<any> {
    return await this.ticketModel.count();
  }

  /*************************************************
   * THE MAXIMUM NUMBER OF TICKETS FOR THE SESSION *
   *************************************************/

  async getMaxTicketFoSession(idSession: string): Promise<number> {
    try {
      return await this.sessionService
        .getOneSession(idSession)
        .then((session) => session.limitTicket);
    } catch (error) {
      throw new UnauthorizedException(
        'Something went wrong when trying to get the max ticket session',
        error,
      );
    }
  }

  /************************
   * UPDATE TICKET PARAMS *
   ************************/

  async updateTicketPut(
    id: string,
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    // return await this.ticketModel.updateOne({_id: id}, createTicketDto);
    return null;
  }

  /*****************
   * DELETE TICKET *
   *****************/

  async deleteTicket(id: string): Promise<Ticket> {
    return await this.ticketModel.findByIdAndDelete(id);
  }

  /******************
   * ASSIGN TICKETS *
   ******************/

  async assignTicket(
    refreshToken: string,
    assignTicketDto: AssignTicketDto,
  ): Promise<any> {
    let userId = await this.authService.findRefreshToken(refreshToken);
    assignTicketDto.idClient = userId.valueOf().toString();
    await this.isTicketClaimed(assignTicketDto.ticketNumber);
    let ticket;
    try {
      ticket = await this.ticketModel.findOneAndUpdate(
        { ticketNumber: assignTicketDto?.ticketNumber },
        { idClient: assignTicketDto?.idClient },
      );
    } catch (error) {
      throw new UnauthorizedException('Sorry the TicketNumber is Wrong', error);
    }

    let group = await this.groupService.getOneGroup(ticket.idGroup);
    // console.log(group, 'RRRRRRRRRRRRRRRRRRRRRRR');
    return group;
    // return null;
  }

  /***********************
   * VERIFY TICKETNUMBER *
   ***********************/

  async verifyTicket(ticketNumber: String): Promise<any> {
    let ticket = await this.getTicketByNumber(ticketNumber);

    if (ticket?.idGroup) {
      let group = await this.groupService.getOneGroup(ticket.idGroup);
      return {
        lot: group.description,
      };
    } else {
      throw new UnauthorizedException('Sorry, this ticket number is invalid.');
    }
  }

  /******************
   * CLAIMED TICKETS *
   ******************/

  async getClaimbedTickets(): Promise<Array<Ticket>> {
    return await this.ticketModel.find({
      $and: [{ idClient: { $exists: true } }, { idClient: { $ne: null } }],
    });
  }

  /************************
   * NOT CLAIMBED TICKETS *
   ************************/

  async getNotClaimedTickets(): Promise<Array<Ticket>> {
    return await this.ticketModel.find({
      $or: [{ idClient: { $exists: false } }, { idClient: { $eq: null } }],
    });
  }

  /********************
   * PRIVATES METHODS *
   ********************/

  /*****************************************
   * GENERATE RANDOM NUMBER OF 10 CARATERS *
   *****************************************/

  private getRandomInt(): String {
    var str = '';
    for (let i = 0; i++ < 10; ) {
      var r = Math.floor(Math.random() * 9);

      str += r.toString();
    }
    // console.log('Generated Code', str, 'Parsed Code: ', parseInt(str));
    return str;
  }

  /******************************************************
   * GET RANDOM GROUP IN ORDER TO AFFECT IT TO A TICKET *
   ******************************************************/

  private async getRandomGroup(i = 0): Promise<string> {
    // return await this.GroupModel.aggregate([{ $sample: { size: 1 } }]);
    // console.log('Start at ' + i); //

    return await this.groupService.getAllGroups().then(async (groups) => {
      let num = Math.random() * 100,
        s = 0;
      i = i == groups.length ? 0 : i;

      for (; i < groups.length; ++i) {
        s += groups[i]?.percentage;
        let ticketsForGroup = await this.getAllTicketForGroup(
          groups[i]._id.valueOf(),
        );
        // console.log(ticketsForGroup, ' FOR the group', groups[i]?.description);
        if (ticketsForGroup < groups[i]?.limitTicket) {
          if (num < s) {
            return groups[i]._id.valueOf();
          } else {
            // console.log('Send to the last group');
            return this.getAllTicketForGroup(groups.pop()._id.valueOf()) <
              groups.pop()?.limitTicket
              ? groups.pop()._id.valueOf()
              : this.getRandomGroup(0);
          }
        } else {
          // console.log(groups[i]?.description + 'is FULL');
          return this.getAllTicketForGroup(groups.pop()._id.valueOf()) <
            groups.pop()?.limitTicket
            ? groups.pop()._id.valueOf()
            : this.getRandomGroup(i + 1);
        }
      }
    });
  }

  /*********************
   * IS TIKET CLAIMBED *
   *********************/
  private async isTicketClaimed(ticketNumber: String): Promise<any> {
    let ticket = await this.getTicketByNumber(ticketNumber);
    // console.log(ticket, 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');

    if (ticket != null) {
      if (ticket.idClient) {
        throw new UnauthorizedException(
          'the number is already used by the a client',
        );
      } else {
        return ticket;
      }
    } else {
      throw new UnauthorizedException('the ticket number is not correct');
    }
  }
}

// let min = 1000000000,
//   max = maxTicketForSession + 1000000000;
// return Math.floor(Math.random() * (max - min)) + min;
// return 8507773157;
// max = 1001500000;

// function randomString(len, an) {
//   an = an && an.toLowerCase();
//   var str = "",
//     i = 0,
//     min = an == "a" ? 10 : 0,
//     max = an == "n" ? 10 : 62;
//   for (; i++ < len;) {
//     var r = Math.random() * (max - min) + min << 0;
//     str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
//   }
//   return str;
// }

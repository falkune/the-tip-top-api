import {
  ConflictException,
  ImATeapotException,
  Injectable,
  ServiceUnavailableException,
  NotAcceptableException,
  forwardRef,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket } from './interfaces/ticket.interface';
import { GroupService } from '../group/group.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../session/session.service';
import { UserService } from 'src/user/user.service';
import { Session } from 'src/session/interfaces/session.interface';
import { DeliverTicketByClientDto } from './dto/deliver-ticket-by-client.dto';
import { DeliverTicketByAdminDto } from './dto/deliver-ticket-by-admin.dto';
import { info } from 'console';


@Injectable()
export class TicketService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private readonly groupService: GroupService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,



  ) { }



  /*******************
   * GENERATE TICKET *
   *******************/


  async createTicket(generateTicketDto: CreateTicketDto): Promise<Array<Ticket>> {

    let [ticket] = await this.ticketModel.aggregate(
      [
        {
          $match:

          {
            $and: [{ idSession: { $eq: generateTicketDto.idSession } }, { isDelivered: { $eq: false }, }, {
              $or: [{ idClient: { $exists: false } }, { idClient: { $eq: null } }]
            },]
          }

        },  // add ticket (isDelivered and haveIdClient) cond
        {
          $sample: { size: 1 }
        }
      ]

   
    )
   if(ticket){
        return ticket;
      }else{
         throw new UnprocessableEntityException('Désolé il n\'y as plus plus de ticket disponible');
      }
    
  }








  /*****************
   * CREATE TICKET *
   *****************/

  async generateTickets(createTicketDto: CreateTicketDto): Promise<any> {

    let session = await this.sessionService.getOneSession(createTicketDto.idSession); ///  get all information about the session passed by the user 
    let groups = await this.groupService.getAllGroups();
    let cal = 1
    if (session && groups) {
      groups.forEach(async group => {

        if (group) {
          let totalTicketForGroup = (group?.percentage * session.limitTicket) / 100;
          let currentTicketsForGroup = await this.getAllTicketForGroup(
            group?._id.valueOf(), session?._id.valueOf()
          );
          totalTicketForGroup = totalTicketForGroup - currentTicketsForGroup;
          for (let index = 0; index < totalTicketForGroup; index++) {
            createTicketDto.ticketNumber = await this.generateTicketNumber(session?._id.valueOf())
            createTicketDto.idGroup = group?._id.valueOf()
            const ticket = new this.ticketModel(createTicketDto);
            await ticket.save();
            
            cal++; //
          }
        } else {
          throw new ConflictException("Désolé il n\'y pas de groupe pour la création de ce ticket .")

        }
      });
    } else {
      throw new ConflictException("Désolé l'\id de session n'\existe pas dans la base de données.")
    }


    return { message: 'Generation de ticket terminée' }
  }



  /************************
   * GENERATE TICKET NUMBER *
   ************************/


  private async generateTicketNumber(idSession: string): Promise<string> {

    let ticketNumber = this.getRandomInt();
    let ticketFound = await this.getTicketByNumberAndSessionId(
      ticketNumber, idSession
    );

    while (ticketFound?.ticketNumber?.toString() == ticketNumber.toString()) {
      let ticketNumber = this.getRandomInt();
      ticketFound = await this.getTicketByNumberAndSessionId(
        ticketNumber, idSession
      );
    }

    return ticketNumber.toString();
  }



  /*********
   * BINGO *
   *********/



  async bingo(idSession: string): Promise<any> {


    const clientIds = await this.ticketModel.distinct("idClient", { "idSession": idSession });
    let clientId = clientIds[Math.floor(Math.random() * clientIds.length)];



    if (clientId) {

      let session = await this.sessionService.setWinner(idSession, clientId)

      let winner = await this.userService.getOneUser(clientId)

      return { session, winner }

    } else {
      throw new UnprocessableEntityException("Désolé, il n'y as pas de ticket généré ou réclamé dans cette session");
    }


  }

  /************************
   * GET TICKET STATISTICS *
   ************************/

  async getTicketStats(idSession: string): Promise<Object> {

    let session = await this.sessionService.getOneSession(idSession);


    let ticketGroupedByGroupId = await this.ticketModel.aggregate(
      [

        {

          $group: {
            _id: '$idGroup',
            "numberOfTickets": {
              "$sum": {
                "$cond": [
                  {
                    "$eq": [
                      "$idSession", idSession
                    ]
                  }, 1,
                  0]
              }
            },
            "notClaimbedTicket": {
              "$sum": {
                "$cond": [
                  {
                    "$and": [
                      {
                        "$or": [
                          {
                            "$eq": [
                              {
                                "$type": "$idClient"
                              },
                              "missing"
                            ]
                          },
                          {
                            "$eq": [
                              "$idClient",
                              null
                            ]
                          }
                        ]
                      },
                      {
                        "$eq": [
                          "$idSession", idSession
                        ]
                      }
                    ]

                  },
                  1,
                  0
                ]
              }
            },
            "claimbedTicket": {
              "$sum": {


                "$cond": [
                  {

                    "$and": [
                      {
                        $gte: ["$idClient", null]
                      },
                      {
                        "$eq": [
                          "$idSession", idSession
                        ]
                      }
                    ]


                  },
                  1,
                  0
                ]
              }
            },
            "deliveredTicket": {
              "$sum": {


                "$cond": [
                  {

                    "$and": [
                      {
                        "$eq": [
                          "$isDelivered", true
                        ]
                      },
                      {
                        "$eq": [
                          "$idSession", idSession
                        ]
                      }
                    ]


                  },
                  1,
                  0
                ]
              }
            },
            "notDeliveredTicket": {
              "$sum": {


                "$cond": [
                  {

                    "$and": [
                      {
                        "$eq": [
                          "$isDelivered", false
                        ]
                      },
                      {
                        "$eq": [
                          "$idSession", idSession
                        ]
                      }
                    ]


                  },
                  1,
                  0
                ]
              }
            },
          }

        }
      ],).sort({ _id: 1 });

    ticketGroupedByGroupId = await this.formatTicketGroupedByGroupId(ticketGroupedByGroupId, session);
    let sessionTotalClaimbedTicket = await this.getComputedVal(ticketGroupedByGroupId, "claimbedTicket");
    let sessionTotalNotClaimbedTicket = await this.getComputedVal(ticketGroupedByGroupId, "notClaimbedTicket");

    let sessionTotalNumberOfTickets = await this.getComputedVal(ticketGroupedByGroupId, "numberOfTickets");
    let sessionTotalNumberOfTicketsPercentage = sessionTotalNumberOfTickets == 0 ? (0).toFixed(2) : ((sessionTotalNumberOfTickets * 100) / session.limitTicket).toFixed(2);

    let sessionClaimbedTicketPercentage = sessionTotalNumberOfTickets == 0 ? (0).toFixed(2) : ((sessionTotalClaimbedTicket * 100) / sessionTotalNumberOfTickets).toFixed(2);
    let sessionNotClaimbedTicketPercentage = sessionTotalNotClaimbedTicket == 0 ? (0).toFixed(2) : ((sessionTotalNotClaimbedTicket * 100) / sessionTotalNumberOfTickets).toFixed(2);

    let sessionTotalDeliveredTicket = await this.getComputedVal(ticketGroupedByGroupId, "deliveredTicket");
    let sessionTotalNotDeliveredTicket = await this.getComputedVal(ticketGroupedByGroupId, "notDeliveredTicket");

    let sessionDeliveredTicketPercentage = sessionTotalNumberOfTickets == 0 ? (0).toFixed(2) : ((sessionTotalDeliveredTicket * 100) / sessionTotalNumberOfTickets).toFixed(2);
    let sessionNotDeliveredTicketPercentage = sessionTotalNotDeliveredTicket == 0 ? (0).toFixed(2) : ((sessionTotalNotDeliveredTicket * 100) / sessionTotalNumberOfTickets).toFixed(2);




    return {
      groupStats: ticketGroupedByGroupId, sessionStats: {
        sessionTotalClaimbedTicket: sessionTotalClaimbedTicket,
        sessionTotalNotClaimbedTicket: sessionTotalNotClaimbedTicket,
        sessionTotalNumberOfTickets: sessionTotalNumberOfTickets,
        sessionTotalDeliveredTicket: sessionTotalDeliveredTicket,
        sessionTotalNotDeliveredTicket: sessionTotalNotDeliveredTicket,
        sessionClaimbedTicketPercentage: sessionClaimbedTicketPercentage,
        sessionNotClaimbedTicketPercentage: sessionNotClaimbedTicketPercentage,
        sessionTotalNumberOfTicketsPercentage: sessionTotalNumberOfTicketsPercentage,
        sessionDeliveredTicketPercentage: sessionDeliveredTicketPercentage,
        sessionNotDeliveredTicketPercentage: sessionNotDeliveredTicketPercentage
      }
    };
  }


  private getComputedVal(arr: Array<any>, attr: string): Promise<number> {
    return arr.reduce(function (prev, cur) {

      return prev + cur[attr];
    }, 0);
  }

  private formatTicketGroupedByGroupId(ticketGroupedByGroupId: Array<any>, session: Session): Promise<Array<Ticket>> {

    return new Promise((resolve, reject) => {
      ticketGroupedByGroupId.forEach(async (el, index, array) => {

        let group = await this.groupService.getOneGroup(el._id);
        el.limitTicket = Math.round((session.limitTicket * group.percentage) / 100);
        el.sessionLimitTicket = session.limitTicket;
        el.numberOfTicketsPercentage = el.limitTicket == 0 ? (0).toFixed(2) : ((el.numberOfTickets * 100) / el.limitTicket).toFixed(2);
        el.claimbedTicketPercentage = el.numberOfTickets == 0 ? (0).toFixed(2) : ((el.claimbedTicket * 100) / el.numberOfTickets).toFixed(2);
        el.notClaimbedTicketPercentage = el.numberOfTickets == 0 ? (0).toFixed(2) : ((el.notClaimbedTicket * 100) / el.numberOfTickets).toFixed(2);
        el.deliveredTicketPercentage = el.numberOfTickets == 0 ? (0).toFixed(2) : ((el.deliveredTicket * 100) / el.numberOfTickets).toFixed(2);
        el.notDeliveredTicketPercentage = el.numberOfTickets == 0 ? (0).toFixed(2) : ((el.notDeliveredTicket * 100) / el.numberOfTickets).toFixed(2);
        el.groupName = group?.description;
        el.percentage = group?.percentage;
        if (index === array.length - 1) resolve(ticketGroupedByGroupId);

      })
    });

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

  /***************************************
   * GET TICKET BY NUMBER AND SESSION ID *
   ***************************************/


  async getTicketByNumberAndSessionId(ticketNumber: String, idSession: string): Promise<Ticket> {

    return await this.ticketModel.findOne(

      { $and: [{ ticketNumber: { $eq: ticketNumber } }, { idSession: { $eq: idSession } }] });

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


  async getAllTicketForGroup(idGroup: string, idSession: string): Promise<number> {
    return await this.ticketModel.find(


      { $and: [{ idGroup: { $eq: idGroup } }, { idSession: { $eq: idSession } }] }).count();


  }

  /*************************
 * GET TICKET BY CLIENTID *
 *************************/


  async getTicketByIdClient(idClient: string): Promise<Array<Ticket>> {
    let userId = await this.authService.findRefreshToken(idClient);
    idClient = userId.valueOf().toString();
    return await this.ticketModel.find({ idClient: { $eq: idClient } });
  }



  /***************************************
   * COUNT THE NUMBER OF CREATED TICKETS *
   ***************************************/

  async getNumberOfCreatedTicketsInsideSession(idSession: string): Promise<any> {
    return await this.ticketModel.find({ idSession: idSession }).count();
  }

  /*************************************************
   * THE MAXIMUM NUMBER OF TICKETS FOR THE SESSION *
   *************************************************/

  async getMaxTicketForSession(idSession: string): Promise<number> {
    try {
      return await this.sessionService
        .getOneSession(idSession)
        .then((session) => session.limitTicket);
    } catch (error) {
      throw new NotAcceptableException(
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
    return null;
  }

  /*****************
   * DELETE TICKET *
   *****************/

  async deleteTicket(id: string): Promise<any> {
    let res = await this.ticketModel.findByIdAndDelete(id);


    if (!res) {
      throw new NotAcceptableException('Le ticket n\'existe pas dans le base de donnée');
    } else {
      return {
        message: 'Le ticket a été bien supprimée',
      }
    }
  }

  /******************
   * ASSIGN TICKETS *
   ******************/

  async assignTicket(
    refreshToken: string,
    assignTicketDto: AssignTicketDto
  ): Promise<any> {
    let userId = await this.authService.findRefreshToken(refreshToken);
    assignTicketDto.idClient = userId.valueOf().toString();
    await this.isTicketClaimed(assignTicketDto.ticketNumber);
    let ticket;
    try {
      ticket = await this.ticketModel.findOneAndUpdate(
        { ticketNumber: assignTicketDto?.ticketNumber }, { idClient: assignTicketDto?.idClient },
      );
    } catch (error) {
      throw new NotAcceptableException('Sorry the TicketNumber is Wrong', error);
    }

    let group = await this.groupService.getOneGroup(ticket.idGroup);
    return group;
  }



  /*********************************
   * * DELIVER TICKETS BY CLIENT * *
   *********************************/

  async deliverTicket(
    refreshToken: string,
    params: DeliverTicketByClientDto,
  ): Promise<any> {
    let userId = await this.authService.findRefreshToken(refreshToken);
    params.idClient = userId.valueOf().toString();
    await this.isTicketClaimedByTheUser(params);
    let ticket;
    try {
      ticket = await this.ticketModel.findOneAndUpdate(
        { ticketNumber: params?.ticketNumber, idClient: params?.idClient },
        { isDelivered: true },

      ); return ticket;
    } catch (error) {
      throw new NotAcceptableException('Désolé, le numéro de ticket ou l\'id du client est incorrecte', error);
    }

  }


  /*************************
 * deliver TICKETS by admin*
 ****************************/

  async deliverTicketByAdmin(
    deliverTicketByAdminDto: DeliverTicketByAdminDto,
  ): Promise<any> {

    await this.isTicketAlreadyDelivered(deliverTicketByAdminDto.ticketNumber);
    let ticket;
    try {
      ticket = await this.ticketModel.findOneAndUpdate(
        { ticketNumber: deliverTicketByAdminDto?.ticketNumber },
        { isDelivered: true },

      ); return ticket;
    } catch (error) {
      throw new NotAcceptableException('Désolé, le numéro de ticket ou l\'id du client est incorrecte', error);
    }

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
      throw new NotAcceptableException('Désolé,le numéro de ticket est invalide');
    }
  }


  /***********************
  * CHECK TICKETNUMBER *
  ***********************/

  async checkTicket(ticketNumber: string): Promise<any> {
    let ticket = await this.getTicketByNumber(ticketNumber);

    if (ticket?.idGroup) {
      let group = await this.groupService.getOneGroup(ticket.idGroup);


      let res = {
        lot: group.description,
        idClient: ticket.idClient,
        isDelivered: ticket.isDelivered,
        idSession: ticket.idSession,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt

      };
      if (ticket?.idClient) {
        let client = await this.userService.getOneUser(ticket.idClient.toString());
        return {
          ...res, fullName: client?.fullName,
          email: client?.email,
        }
      } else {
        return res;
      }



    } else {
      throw new NotAcceptableException("Désolé, le ticket  n'est pas associé à un lot.");
    }
  }


  /*****************************
   * GET TICKETS BY SESSION_ID *
   *****************************/

  async getTicketBySession(idSession: string): Promise<Array<Ticket>> {
    return await this.ticketModel.find({ idSession: { $eq: idSession } });
  }

  /***********************************
   * GET CLAIMBED TICKETS BY SESSION *
   ***********************************/

  async getClaimbedTicketsBySession(idSession: string): Promise<Array<Ticket>> {



    return await this.ticketModel.find({
      idSession: { $eq: idSession },
      $and: [
        {
          $or: [{ idClient: { $exists: true } }, { idClient: { $ne: null } }]
        },

      ],
    });
  }


  /***********************************
   * GET CLAIMBED NOT TICKETS BY SESSION *
   ***********************************/

  async getNotClaimbedTicketsBySession(
    idSession: string,
  ): Promise<Array<Ticket>> {
    return await this.ticketModel.find({
      $and: [
        {
          $or: [{ idClient: { $exists: false } }, { idClient: { $eq: null } }],
        },
        { idSession: { $eq: idSession } }
      ],
    });
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
    let str = '';
    for (let i = 0; i++ < 10;) {
      let r = Math.floor(Math.random() * 9);

      str += r.toString();
    }
    return str;
  }

  /******************************************************
   * GET RANDOM GROUP IN ORDER TO AFFECT IT TO A TICKET *
   ******************************************************/

  private async getRandomGroup(i: number, idSession: string, maxTicketForSession: number): Promise<string> {


    let groups = await this.groupService.getAllGroups();




    return await this.groupService.getAllGroups().then(async (groups) => {

      let group = groups[i];
      let lastGroup = groups[groups.length - 1];
      let num = Math.random() * 100,
        s = 0;
      i = i == groups.length ? 0 : i;

      for (; i < groups.length; ++i) {
        s += group?.percentage;

        let ticketsForGroup = await this.getAllTicketForGroup(
          group?._id.valueOf(), idSession
        );

        let session = await this.sessionService.getOneSession(idSession)
        let totalTicketForGroup = (group?.percentage * session.limitTicket) / 100;
        if (ticketsForGroup < totalTicketForGroup) {

          if (num < s) {
            return group._id.valueOf();
          } else {

            let tmp_alllTicket;
            await this.getAllTicketForGroup(lastGroup._id.valueOf(), idSession).then((val) => {
              tmp_alllTicket = val;
            });

            let limitticketOfTheLastGroup = (lastGroup?.percentage * session.limitTicket) / 100
            return tmp_alllTicket <
              limitticketOfTheLastGroup
              ? lastGroup?._id.valueOf()
              : await this.getRandomGroup(0, idSession, maxTicketForSession).then((nu) =>
                nu
              );
          }
        } else {

          return this.getAllTicketForGroup(lastGroup._id.valueOf(), idSession) <
            lastGroup?.limitTicket
            ? lastGroup._id.valueOf()
            : this.getRandomGroup(i + 1, idSession, maxTicketForSession);
        }
      }
      return null;
    });
  }

  /*********************
   * IS TIKET CLAIMBED *
   *********************/
  private async isTicketClaimed(ticketNumber: string): Promise<any> {
    let ticket = await this.getTicketByNumber(ticketNumber);

    if (ticket != null) {
      if (ticket.idClient) {
        throw new ConflictException(
          'Le numéro de ticket déjà été réclamé par un client.',
        );
      } else {
        return ticket;
      }
    } else {
      throw new NotAcceptableException('Désolé, le numéro de ticket est incorrecte');
    }
  }

  /**********************************
  ** IS TIKET CLAIMBED by the user **
  ***********************************/
  private async isTicketClaimedByTheUser(deliverTicketByClientDto: DeliverTicketByClientDto): Promise<any> {
    await this.isTicketAlreadyDelivered(deliverTicketByClientDto.ticketNumber);
    let ticket = await this.getTicketByNumber(deliverTicketByClientDto.ticketNumber);

    if (ticket != null && ticket.idClient) {
      if (ticket.idClient.toString() === deliverTicketByClientDto.idClient) {
        return ticket;
      } else {
        throw new NotAcceptableException('Le numéro de ticket fournit n’appartient pas à ce client.');
      }
    } else {
      throw new NotAcceptableException('Le numéro du ticket fournit est incorrecte ou il n\'as pas encore été réclamé pas un client.');
    }
  }
  private async isTicketAlreadyDelivered(ticketNumber: string): Promise<any> {
    let ticket = await this.getTicketByNumber(ticketNumber);

    if (ticket) {
      if (!ticket.isDelivered) {
        return ticket;
      } else {
        throw new NotAcceptableException('Le gain associé à ce ticket a déjà été délivré.');
      }
    } else {
      throw new NotAcceptableException('Le numéro du ticket fournit est incorrecte ou il n\'as pas encore été réclamé pas un client.');
    }
  }






  // private async getRandomGroup(i: number, idSession: string, maxTicketForSession: number): Promise<string> {


  //   return await this.groupService.getAllGroups().then(async (groups) => {

  //     let group = groups[i];
  //     let lastGroup = groups[groups.length - 1];
  //     let num = Math.random() * 100,
  //       s = 0;
  //     i = i == groups.length ? 0 : i;

  //     for (; i < groups.length; ++i) {
  //       s += group?.percentage;

  //       let ticketsForGroup = await this.getAllTicketForGroup(
  //         group?._id.valueOf(), idSession
  //       );

  //       let session = await this.sessionService.getOneSession(idSession)
  //       let totalTicketForGroup = (group?.percentage * session.limitTicket) / 100;
  //       if (ticketsForGroup < totalTicketForGroup) {

  //         if (num < s) {
  //           return group._id.valueOf();
  //         } else {

  //           let tmp_alllTicket;
  //           await this.getAllTicketForGroup(lastGroup._id.valueOf(), idSession).then((val) => {
  //             tmp_alllTicket = val;
  //           });

  //           let limitticketOfTheLastGroup = (lastGroup?.percentage * session.limitTicket) / 100
  //           return tmp_alllTicket <
  //             limitticketOfTheLastGroup
  //             ? lastGroup?._id.valueOf()
  //             : await this.getRandomGroup(0, idSession, maxTicketForSession).then((nu) =>
  //               nu
  //             );
  //         }
  //       } else {

  //         return this.getAllTicketForGroup(lastGroup._id.valueOf(), idSession) <
  //           lastGroup?.limitTicket
  //           ? lastGroup._id.valueOf()
  //           : this.getRandomGroup(i + 1, idSession, maxTicketForSession);
  //       }
  //     }
  //     return null;
  //   });
  // }
}

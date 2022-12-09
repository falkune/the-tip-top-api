import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './interfaces/session.interface';
import { CreateSessionDto } from './dto/create-session.dto';
import { LoggerService } from '../logger/logger.service';
import { SetCurrentSessionDto } from './dto/set-current-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly SessionModel: Model<Session>,
    private readonly logger: LoggerService

  ) { }

  /*****************
   * CREATE Session *
   *****************/

  async createSession(createSessionDto: CreateSessionDto): Promise<any> {


    const Session = new this.SessionModel(createSessionDto);
    await Session.save();
    return { message: "Session créée avec success " };
  }

  /******************
   * GET ALL Session *
   ******************/

  async getAllSessions(): Promise<any> {
    return await this.SessionModel.find({});
  }

  /********************
 * GET CURRENT SESSION *
 **********************/

  async getCurrentSession(): Promise<any> {
    return await this.SessionModel.find({ isCurrent: true });
  }


  /******************
   * GET ONE Session *
   ******************/

  async getOneSession(id: string): Promise<Session> {
    return await this.SessionModel.findById(id);
  }

  /***************************
   * GET Session WHITH PARAMS *
   ***************************/

  async getSession(id: number): Promise<Session> {
    return await this.SessionModel.findOne({ SessionNumber: id });
  }

  /***************************
   * COUNT NUMBER OF RECORDS *
   ***************************/

  async geCount(): Promise<any> {
    return await this.SessionModel.count();
  }

  /************************
   * UPDATE Session PARAMS *
   ************************/

  async updateSessionPut(
    id: string,
    createSessionDto: CreateSessionDto,
  ): Promise<Session> {
    return await this.SessionModel.findOneAndUpdate({ _id: id }, createSessionDto);

  }

  /***********************
   * SET CURRENT SESSION *
   ***********************/

  async setCurrentSession(
    setCurrentSessionDto: SetCurrentSessionDto
  ): Promise<Session> {
    let ticket;
    try {
      ticket = await this.SessionModel.findOneAndUpdate({ _id: setCurrentSessionDto.idSession }, { isCurrent: setCurrentSessionDto?.isCurrent })

    } catch (error) {
      throw new NotAcceptableException('Sorry the TicketNumber is Wrong', error);
    }

    return ticket;

  }

  /******************
   * DELETE Session *
   *******************/

  async deleteSession(id: string): Promise<any> {
    let res = await this.SessionModel.findByIdAndDelete(id);
    console.log(res);
    

    if(!res){
      throw new NotAcceptableException('La session n\'existe pas dans le base de donnée');
    }else{
      return {
        message: 'La session a été bien supprimée',  
      }
    }

  }


}

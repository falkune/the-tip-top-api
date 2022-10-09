import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './interfaces/session.interface';
import { CreateSessionDto } from './dto/create-session.dto'; 
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly SessionModel: Model<Session>,
       private readonly logger  : LoggerService
 
  ) {}

  /*****************
   * CREATE Session *
   *****************/

  async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    console.log('Savaing ...');

    const Session = new this.SessionModel(createSessionDto);
    await Session.save();
    return Session;
  }

  /******************
   * GET ALL Session *
   ******************/

  async getAllSessions(): Promise<any> {
    return await this.SessionModel.find({});
  }

  /******************
   * GET ONE Session *
   ******************/

  async getOneSession(id: String): Promise<Session> {
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
    // return await this.SessionModel.updateOne({_id: id}, createSessionDto);
    return null;
  }

  /*****************
   * DELETE Session *
   *****************/

  async deleteSession(id: string): Promise<Session> {
    return await this.SessionModel.findByIdAndDelete(id);
  }

 
}

import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Group } from './interfaces/group.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { SessionService } from 'src/session/session.service';;

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('Group') private readonly GroupModel: Model<Group>, 
    private readonly sessionService: SessionService,
  ) {}

  /*****************
   * CREATE GROUP *
   *****************/

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {

  
    let totalProbabilities = await this.sumProbabilities().then((t) =>
      t && t[0] ? t[0].percentage : 0,
    ); 
    console.table('Total probabilities: ' + totalProbabilities);

    // console.log(createGroupDto.GroupNumber);

    if (totalProbabilities + createGroupDto.percentage <= 100) {
  
      createGroupDto.limitTicket = 100*createGroupDto.percentage/100;
      await this.isDescriptionUniq(createGroupDto.description);
      const Group = new this.GroupModel(createGroupDto);
      await Group.save();
      return Group;
    } else {
      throw new BadRequestException(
        'there is an inconsistency with the percentages',
      );
    }
  }

  /******************
   * GET ALL Group *
   ******************/

  async getAllGroups(): Promise<any> {
    return await this.GroupModel.find({});
  }

  /******************
   * GET ONE Group *
   ******************/

  async getOneGroup(id: string): Promise<Group> {
    console.log('getOneGroup', id);
    return await this.GroupModel.findById(id);
  }

  /***************************
   * GET Group WHITH PARAMS *
   ***************************/

  async getGroup(id: number): Promise<Group> {
    return await this.GroupModel.findOne({ id: id });
  }

  /***************************
   * COUNT NUMBER OF RECORDS *
   ***************************/

  async geCount(): Promise<any> {
    return await this.GroupModel.count();
  }

  /************************
   * UPDATE Group PARAMS *
   ************************/

  async updateGroupPut(
    id: string,
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    // return await this.GroupModel.updateOne({_id: id}, createGroupDto);
    return null;
  }

  /*****************
   * DELETE Group *
   *****************/

  async deleteGroup(id: string): Promise<Group> {
    return await this.GroupModel.findByIdAndDelete(id);
  }

  /*******************
   * PRIVATE METHODS *
   *******************/

  /*****************************
   * GET SUM OF PROBABILITIES *
   *****************************/

  private async sumProbabilities(): Promise<Object> {
    return this.GroupModel.aggregate([
      { $group: { _id: null, percentage: { $sum: '$percentage' } } },
    ]);
  }

  /**************************************************
   * CHECK IF THE GROUP DESCRIPTION IS ALREADY USED *
   **************************************************/
  private async isDescriptionUniq(description: string) {
    const user = await this.GroupModel.findOne({ description });
    if (user) {
      throw new BadRequestException('Description most be unique.');
    } 
  }


  private getLimitTicket(id: String, percentage: number) : Promise<number> {
      try {
        return this.sessionService.getOneSession(id).then((session) => {
          console.log('Session: ', session, percentage);
          return (session?.limitTicket*percentage)/100;
          
        });
      } catch (error) {
        throw new BadRequestException("Not session found for this id: " + id );
      }
  }

}

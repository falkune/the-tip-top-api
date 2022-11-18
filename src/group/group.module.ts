import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './schemas/group.schema';
import { SessionModule } from '../session/session.module';
import { SessionSchema } from '../session/schemas/session.schema';
import { SessionService } from '../session/session.service';
import { LoggerModule } from '../logger/logger.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema}]),

    SessionModule,LoggerModule
  ],
  controllers: [GroupController],
  providers: [GroupService,SessionService],
})
export class GroupModule {}

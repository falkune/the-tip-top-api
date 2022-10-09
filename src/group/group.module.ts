import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './schemas/group.schema';
import { SessionModule } from 'src/session/session.module';
import { SessionSchema } from 'src/session/schemas/session.schema';
import { SessionService } from 'src/session/session.service';
import { LoggerModule } from 'src/logger/logger.module';


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

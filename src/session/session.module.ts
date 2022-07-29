import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schemas/session.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Session', schema: SessionSchema}]),
  ],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}

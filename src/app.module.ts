import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [UserModule, TicketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { TicketsModule } from "./tickets/tickets.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    TicketsModule,
    AuthModule,
  ], 

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: false,
// }
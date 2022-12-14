import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TicketModule } from './ticket/ticket.module';
import { MailModule } from './mail/mail.module';
import { GroupModule } from './group/group.module';
import { SessionModule } from './session/session.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { FacebookStrategy } from './auth/strategies/facebook.strategy';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { UrlGeneratorModule } from 'nestjs-url-generator';
//import { urlGeneratorModuleConfig } from 'configs/signed-url.config';


@Module({
  imports: [ 
    MongooseModule.forRoot(process.env.MONGO_URI_PROD),
    UrlGeneratorModule.forRoot({
      secret: process.env.APP_KEY, // optional, required only for signed URL
      appUrl: process.env.APP_URL
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      }
    }),
    UserModule,
    AuthModule,
    TicketModule,
    GroupModule,
    SessionModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FacebookStrategy, GoogleStrategy],
})
export class AppModule { }






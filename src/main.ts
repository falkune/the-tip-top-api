import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { warn } from 'console';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GroupModule } from './group/group.module';
import { SessionModule } from './session/session.module';
import { LoggerModule } from './logger/logger.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import * as hbs from 'express-handlebars';
import { printName } from './hbs/helpers'; 





import {
  NestjsWinstonLoggerService,
  appendRequestIdToLogger,
  LoggingInterceptor,
  morganRequestLogger,
  morganResponseLogger,
  appendIdToRequest
} from "nestjs-winston-logger";

import { format, transports } from "winston";
import helmet from "helmet"; 
async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  const globalLogger = new NestjsWinstonLoggerService({
    format: format.combine(
      format.timestamp({ format: "isoDateTime" }),
      format.json(),
      format.colorize({ all: true }),
    ),
    transports: [
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.Console(),
    ],
    level: "verbose"
  });
  app.use(helmet());
  app.useLogger(globalLogger);
  




  // append id to identify request
  app.use(appendIdToRequest);
  app.use(appendRequestIdToLogger(globalLogger));

  app.use(morganRequestLogger(globalLogger, ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
  app.use(morganResponseLogger(globalLogger, ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));



  app.useGlobalInterceptors(new LoggingInterceptor(globalLogger));

  // new code

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');

  app.engine(
    'hbs',
    hbs({
      extname: 'hbs',
      defaultLayout: 'layout_main',
      layoutsDir: resolve('./src/views/layouts'),
      partialsDir: resolve('./src/views/partials'),
      helpers: { printName },
    }),
  );


  app.setViewEngine('hbs');
  app.enableCors();

  // ╦ ╦╔═╗╔═╗  ╔═╗╦  ╔═╗╔╗ ╔═╗╦    ╔═╗╦╔═╗╔═╗╔═╗
  // ║ ║╚═╗║╣   ║ ╦║  ║ ║╠╩╗╠═╣║    ╠═╝║╠═╝║╣ ╚═╗
  // ╚═╝╚═╝╚═╝  ╚═╝╩═╝╚═╝╚═╝╩ ╩╩═╝  ╩  ╩╩  ╚═╝╚═╝
  app.useGlobalPipes(new ValidationPipe({
    // disableErrorMessages: true,
  }));

  // ╔═╗╦ ╦╔═╗╔═╗╔═╗╔═╗╦═╗
  // ╚═╗║║║╠═╣║ ╦║ ╦║╣ ╠╦╝   
  // ╚═╝╚╩╝╩ ╩╚═╝╚═╝╚═╝╩╚═

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API de thetiptop')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [
      UserModule,
      TicketModule,
      GroupModule,
      SessionModule,
      LoggerModule
    ],
  });
  SwaggerModule.setup('api', app, document);

  // ╔╦╗╔═╗╔═╗╦╔╗╔╔═╗  ╔═╗╔╗╔╔╦╗  ╦  ╦╔═╗╔╦╗╔═╗╔╗╔  ╔╦╗╔═╗  ╔═╗╔═╗╦═╗╔╦╗
  // ║║║╣ ╠╣ ║║║║║╣    ╠═╣║║║ ║║  ║  ║╚═╗ ║ ║╣ ║║║   ║ ║ ║  ╠═╝║ ║╠╦╝ ║
  // ═╩╝╚═╝╚  ╩╝╚╝╚═╝  ╩ ╩╝╚╝═╩╝  ╩═╝╩╚═╝ ╩ ╚═╝╝╚╝   ╩ ╚═╝  ╩  ╚═╝╩╚═ ╩
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  warn(`APP IS LISTENING TO PORT ${PORT}`);
}
bootstrap();





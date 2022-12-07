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
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { printName } from './hbs/helpers';


async function bootstrap() {
 // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.engine(
    'hbs',
    hbs({
      extname: 'hbs',
      defaultLayout: 'layout_main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
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

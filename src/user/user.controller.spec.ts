import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailerService } from '@nestjs-modules/mailer'; 
import { UserModule } from './user.module';
import { MailModule } from '../mail/mail.module';
import { MailController } from '../mail/mail.controller';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController,MailController],
      providers: [UserService,MailerService],
      imports: [UserModule,MailModule]
    }).compile();

    userController = app.get<UserController>(UserController);
  });
  it('it should  be defined', () => {
    expect(userController).toBeDefined();
  });


});    
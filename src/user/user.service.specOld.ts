import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserService]
    }).compile();

    userService = app.get<UserService>(UserService);
  });
  it('it should  be defined', () => {
    expect(userService).toBeDefined();
  });


});    
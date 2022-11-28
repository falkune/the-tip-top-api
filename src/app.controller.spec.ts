import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });


  it('it should  be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('root', () => {
    it('should return "Api of thetiptop Game"', () => {
      expect(appController.getAppName()).toBe( "Api of thetiptop game");
    });
  });
});
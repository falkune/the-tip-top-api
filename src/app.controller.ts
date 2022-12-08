import { Controller, Get, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getAppName(): string {
    return this.appService.getAppName();
  }

  @Get('name')
  printName(@Res() res: Response) {
    return res.render('emmer', { message: 'Hello world!!' });
  }

  @Get('layout')
  anotherLayout(@Res() res: Response) {
    return res.render('print', {
      layout: 'layout_other',
      message: 'Hello world!!',
    });
  }

  @Get('array')
  getArray(@Res() res: Response) {
    const contentArray = [
      { message: 'first' },
      { message: 'second' },
      { message: 'third' },
    ];
    return res.render('array', { myArray: contentArray });
  }


}


import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppName(): any {
    return 'Api of thetiptop game';
  }
}

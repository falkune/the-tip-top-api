import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppName(): any {
    return 'Api of thetiptop game';
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from social network';
    }

    return {
      message: 'User information from social network',
      user: req.user
    }
  }
}

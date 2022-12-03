import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppName(): any {
    return 'Api of thetiptop game';
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}

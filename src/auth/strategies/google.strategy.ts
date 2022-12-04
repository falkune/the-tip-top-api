
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/user/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails,id,provider } = profile
    const user = {
      email: emails[0].value,
      fullName: name.givenName +" "+ name.familyName,   
      socialNetworkUserId:id,
      socialNetworkAccessToken:accessToken,
      socialNetworkProvider: provider,
      password: "refreshToken"
    }
    done(null, user);
  }
}
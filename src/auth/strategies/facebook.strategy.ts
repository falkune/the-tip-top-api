import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "http://localhost:3000/user/facebook/redirect",
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
   

    const { name, emails ,id, provider} = profile;
    const user = {
      email: emails[0].value,
      fullName: name.givenName +" "+ name.familyName, 
      socialNetworkUserId:id,
      socialNetworkAccessToken:accessToken,
      socialNetworkProvider: provider
    };
   /* const payload = {
      user,
      accessToken,

    };*/

    done(null, user);
    
  }
}
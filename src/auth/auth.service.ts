import { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  Injectable,
  UnauthorizedException, 
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { User } from '../user/interfaces/user.interface';
import { RefreshToken } from './interfaces/refresh-token.interface'; 
import { v4 } from 'uuid';
import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { IPinfoWrapper } from 'node-ipinfo';

import * as Cryptr from 'cryptr';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthService {
  cryptr: any;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService, 
    private readonly logger  : LoggerService,
  ) {
    this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
  }
 
  async createAccessToken(userId: string) {
    
    const accessToken = sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return this.encryptText(accessToken);
  }

  async createRefreshToken(req: Request, userId) { 
 
    this.logger.log('Alert! Access token is already associated',AuthService.name);
    const UserLocation = await this.getLocationInfo(req);
    const refreshToken = new this.refreshTokenModel({
      userId,
      refreshToken: v4(),
      ip: this.getIp(req),
      browser: this.getBrowserInfo(req),
      country: this.getCountry(req),
      userLocation: UserLocation,
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }

  async findRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('User has been logged out.');
    }
    return refreshToken.userId;
  }

 
  /****************************
   * FIND USER BY ACCESSTOKEN *
   ****************************/

  async validateUser(jwtPayload: JwtPayload): Promise<any> {
    const user = await this.userModel.findOne({
      _id: jwtPayload.userId,
      verified: true,
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }


/**********
 * LOGOUT *
 **********/


 async logout(refreshToken: String): Promise<any> {
  const res = await this.refreshTokenModel.deleteOne({
    refreshToken: refreshToken
  });
  if (res.acknowledged && res.deletedCount == 1) {
     return {message:"Vous ??tes bien d??connect??"}
  }else{
    throw new UnauthorizedException('User has been already logged out.')
  }
  
}


  //   ?????? ????????????  ??????????????? ??????????????????????????????????????????????????????????????????
  //   ???????????? ???   ?????? ???????????? ??? ?????????????????????   ??? ??? ????????????
  //  ??????????????? ???   ???????????? ?????? ??? ???????????? ???????????? ??? ??????????????????
  private jwtExtractor(request) {
    let token = null;
    if (request.header('x-token')) {
      token = request.get('x-token');
    } else if (request.headers.authorization) {
      token = request.headers.authorization
        .replace('Bearer ', '')
        .replace(' ', '');
    } else if (request.body.token) {
      token = request.body.token.replace(' ', '');
    }
    if (request.query.token) {
      token = request.body.token.replace(' ', '');
    }
    const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    if (token) {
      try {
        token = cryptr.decrypt(token);
      } catch (err) {
        throw new BadRequestException('Bad request.');
      }
    }
    return token;
  }

  // ***********************
  // ?????????????????????????????? ??????????????????????????????
  // ???????????????  ??? ???????????? ??? ???????????????
  // ??? ???????????? ??? ??? ??????????????????????????????
  // ***********************
  returnJwtExtractor() {
    return this.jwtExtractor;
  }

  getIp(req: Request): string {
    return getClientIp(req);
  }
  async getLocationInfo(req: Request): Promise<Object> {
    let ip = await getClientIp(req);

    const ipinfo = new IPinfoWrapper('cec88b6b1d6573');
    return ipinfo.lookupIp(ip);
  }

  getBrowserInfo(req: Request): string {
    return req.header['user-agent'] || 'XX';
  }

  getCountry(req: Request): string {
    return req.header['cf-ipcountry'] ? req.header['cf-ipcountry'] : 'XX';
  }

  encryptText(text: string): string {
    return this.cryptr.encrypt(text);
  }
}

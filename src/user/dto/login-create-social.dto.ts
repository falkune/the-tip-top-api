import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCreateSocialUser {
  // fullName
  @ApiProperty({
    example: 'cheikh THIAM',
    description: 'The name of the User',
    format: 'string',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly fullName: string;

  // Email
  @ApiProperty({
    example: 'cheikh@gmail.com',
    description: 'The email of the User',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  // SocialNetworkUserId
  @ApiProperty({
    example: 'my social network user id is 2423521625RT162532T4Y231T45312',
    description: 'The social network userId',
    format: 'string',
    minLength: 1,
    maxLength: 1024,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @IsString()
  @MaxLength(1024)
  readonly socialNetworkUserId: string;

  //Social provider
  @ApiProperty({
    description: 'Name of the social network provider',
    format: 'string',
  })
  @IsString()
  readonly socialNetworkProvider: string;

  //access token
  @ApiProperty({
    description: 'access token provided by the social network provider',
    format: 'string',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly socialNetworkAccessToken: string;

  // Date of birth
  @ApiProperty({
    example: 'I was born !',
    description: 'Date of birth of the User',
    format: 'date',
  })
  @IsString()
  birthday: string;

  // password
  @ApiProperty({
    example: 'password',
    description: 'password',
    format: 'string',
  })
  @IsString()
  password: string;

  // verified
  @ApiProperty({
    example: 'true',
    description: 'is verified',
    format: 'boolean',
  })
  @IsBoolean()
  verified: boolean ;


}

import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForgotPasswordDto {
    @ApiProperty({
      example: 'cheikh@gmail.com',
      description: 'The email of the User',
      format: 'email',
      uniqueItems: true,
      minLength: 5,
      maxLength: 255,
    })
    

    @IsNotEmpty({ message: "l\'email ne peux pas être vide" })
    @IsString({ message: "l\'email doit être une chaîne de caractère" })
    @MinLength(5, { message: "l\'email ne doit être au minimum composé de 5 caractère" })
    @MaxLength(255, { message: "l\'email ne pas doit être au maximum composé de 255 caractère" })
    @IsEmail({ message: "l\'email doit être un email" })
    readonly email: string;
  }

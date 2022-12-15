import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  // fullName
  @ApiProperty({
    example: 'Furious DUCK',
    description: 'The name of the User',
    format: 'string',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty({ message: "Le nom complet ne peux pas être vide" })
  @IsString({ message: "Le nom complet doit être une chaîne de caractère" })
  @MinLength(6, { message: "le nom complet doit être au minimum composé de 5 caractère" })
  @MaxLength(255, { message: "le nom complet pas doit être au maximum composé de 255 caractère" })
  readonly fullName: string;

  // Email
  @ApiProperty({
    example: 'furious@gmail.com',
    description: 'The email of the User',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  @IsNotEmpty({ message: "l\'email ne peux pas être vide" })
  @IsString({ message: "l\'email doit être une chaîne de caractère" })
  @MinLength(5, { message: "l\'email doit être au minimum composé de 5 caractère" })
  @MaxLength(255, { message: "l\'email ne pas doit être au maximum composé de 255 caractère" })
  @IsEmail({ message: "l\'email doit être un email" })
  readonly email: string;

  // Password
  @ApiProperty({
    example: 'secret password change me!',
    description: 'The password of the User',
    format: 'string',
    minLength: 5,
    maxLength: 1024,
  })
  @IsNotEmpty({ message: "le mot de passe ne peux pas être vide" })
  @IsString({ message: "le mot de passe une chaîne de caractère" })
  @MinLength(5, { message: "le mot de passe doit être au minimum composé de 5 caractère" })
  @MaxLength(1024, { message: "le mot de passe doit être au maximum composé de 1024 caractère" })

  readonly password: string;

  // Date of birth
  @ApiProperty({
    example: '15/12/2002',
    description: 'Date of birth of the User',
    format: 'date',
  })
  @IsNotEmpty({ message: "la date de naissance ne peux pas être vide" })
  @IsString({ message: "l\'email doit être une chaîne de caractère" })
  readonly birthday: string;
}

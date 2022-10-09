import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString, 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  // @ApiProperty({
  //   example: 'Example Title',
  //   description: 'Title of ticket',
  //   format: 'string',
  //   minLength: 6,
  //   maxLength: 255,
  // })
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(5)
  // @MaxLength(255)
  // readonly title: string;

  // @ApiProperty({
  //   example: 'Body exmaple ...',
  //   description: 'Main part of ticket',
  //   format: 'string',
  // })
  // @IsNotEmpty()
  // @IsString()
  // readonly body: string;

  @ApiProperty({
    example: 'ticketNumber exmaple ... 032752375705450273450723047',
    description: ' This is generated by the backend.',
    format: 'string',
  })
  ticketNumber: String;

  @ApiProperty({
    example: 'InGroup exmaple ... 032752375705450273450723047',
    description: ' This is generated by the backend.',
    format: 'string',
  })
  idGroup: string;

  @ApiProperty({
    example: 'idSession exmaple ... 032752375705450273450723047',
    description: 'Indentifier of the session where the ticket is part of',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  idSession: string;
}

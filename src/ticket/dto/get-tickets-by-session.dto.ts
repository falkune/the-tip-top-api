import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTicketBySessionDto {
  @ApiProperty({
    example: 'idSession example ... 032752375705450273450723047',
    description: 'Indentifier of the session where the ticket is part of',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  idSession: string;
}

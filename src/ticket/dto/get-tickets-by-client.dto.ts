import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTicketByClientDto {
  @ApiProperty({
    example: 'idClient exmaple ... 032752375705450273450723047',
    description: 'Indentifier of the client who get his tickets',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString()
  idClient: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTicketBySessionDto {
  @ApiProperty({
    example: 'idSession example ... 032752375705450273450723047',
    description: 'Indentifier of the session where the ticket is part of',
    format: 'string',
  })
  @IsNotEmpty({message: "l\'id de la session ne peut pas être vide"})
  @IsString({message: "l\'id de la session doit être une chaîne de caractère"}) 
  idSession: string;
}

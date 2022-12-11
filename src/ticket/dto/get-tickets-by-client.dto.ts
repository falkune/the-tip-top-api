import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTicketByClientDto {
  @ApiProperty({
    example: 'idClient example ... 032752375705450273450723047',
    description: 'Indentifier of the client who get his tickets',
    format: 'string',
  })
  @IsNotEmpty({message: "l\'id du client ne peut pas être vide"})
  @IsString({message: "l\'id du client doit être une chaîne de caractère"}) 
  idClient: string;
}

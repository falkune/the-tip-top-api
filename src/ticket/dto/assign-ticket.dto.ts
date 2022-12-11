import {
  IsNotEmpty,  
  IsString, 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTicketDto {
 
  @ApiProperty({
    example: '639342b2d71ec7e371800b37',
    description: 'Id of the client who owns the ticket',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString() 
  idClient: string;

  @ApiProperty({
    example: '1234567891',
    description: 'ticketNumber of the ticket which will be assigned to the client',
    format: 'String',
  })
  @IsNotEmpty({message: "le numéro de ticket ne peut pas être vide"})
  @IsString({message: "le numéro de ticket doit être une chaîne de caractère"}) 
  readonly ticketNumber: string;

}

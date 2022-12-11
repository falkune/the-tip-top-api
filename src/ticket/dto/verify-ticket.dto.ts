import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTicketDto {
  @ApiProperty({
    example: '1234567890',
    description:
      'ticketNumber of the ticket which will be assigned to the client',
    format: 'String',
  })
  @IsNotEmpty({message: "le numéro de ticket ne peut pas être vide"})
  @IsString({message: "le numéro de ticket doit être une chaîne de caractère"}) 
  readonly ticketNumber: string;
}

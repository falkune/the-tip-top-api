import {
  IsNotEmpty,  
  IsString, 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliverTicketByClientDto {
 
  @ApiProperty({
    example: '6546h4e4h6df65h46tu5',
    description: 'Id of the client who owns the ticket',
    format: 'string',
  })
  @IsNotEmpty()
  @IsString() 
  idClient: string;

  @ApiProperty({
    example: '6546h4e4h6df65h46tu5',
    description: 'ticketNumber of the ticket which will be delivered to the client',
    format: 'String',
  })
  @IsNotEmpty()
  @IsString() 
  readonly ticketNumber: string;

}

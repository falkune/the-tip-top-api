import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTicketDto {
  @ApiProperty({
    example: '6546h4e4h6df65h46tu5',
    description:
      'ticketNumber of the ticket which will be assigned to the client',
    format: 'string',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly ticketNumber: number;
}

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class SetWinnerOfTheSession {
    

    @ApiProperty({
        example: '0208410488',
        description: 'Ticket number winner of the session',
        format: 'string',
    }) 
    @IsString()
    tiketNumber: string;

     @ApiProperty({
        example: '456457724HB78V245VB5KP272',
        description: 'Identifier of the session',
        format: 'string',
    })  
    @IsString()
    readonly idSession: string; 
}
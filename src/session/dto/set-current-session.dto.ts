import { IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class SetCurrentSessionDto {
    

    @ApiProperty({
        example: 'TRUE or FALSE ...',
        description: 'Value of the field isCurrentSession',
        format: 'Boolean',
    }) 
    @IsBoolean()
     isCurrentSession: Boolean;

     @ApiProperty({
        example: '456457724HB78V245VB5KP272',
        description: 'Identifier of the session',
        format: 'number',
    })  
    @IsNumber()
    readonly limitTicket: number; 
}
import {  IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class SetCurrentSessionDto {
    

    @ApiProperty({
        example: 'TRUE or FALSE ...',
        description: 'Value of the field isCurrentSession',
        format: 'Boolean',
    }) 
    @IsBoolean()
    isCurrent: boolean;

     @ApiProperty({
        example: '456457724HB78V245VB5KP272',
        description: 'Identifier of the session',
        format: 'number',
    })  
    @IsString()
    readonly idSession: string; 
}
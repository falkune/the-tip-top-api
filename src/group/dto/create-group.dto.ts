import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
    @ApiProperty({
        example: 'Thé à infusion',
        description: 'Description of Group',
        format: 'string',
        minLength: 6,
        uniqueItems: true,
        maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly description: string;


    @ApiProperty({
        example: '0.5',
        description: 'Percentage of Group',
        format: 'number',
    })
    @IsNotEmpty()
    @IsNumber()
    readonly percentage:number;  

   /* @ApiProperty({
        example: '1654665',
        description: 'limitTicket which can hosted in this group according to the limitTicket of the session',
        format: 'number',
    })
     limitTicket:number;  */
     @ApiProperty({
        example: '36524652346345631675',
        description: 'id of the session of Group',
        format: 'number',
    })
    @IsNotEmpty()
    @IsString()
    readonly sessionId:string;  

 
}
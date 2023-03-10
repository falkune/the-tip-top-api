import { IsNotEmpty, IsString,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Date } from 'mongoose';

export class CreateSessionDto {
    @ApiProperty({
        example: '20/01/2020',
        description: 'Start date of  the session',
        format: 'string',
 
    })
    @IsNotEmpty()
    @IsString() 
    readonly startDate: Date;

    @ApiProperty({
        example: '20/03/2020',
        description: 'End date of  the session',
        format: 'string',
 
    })
    @IsNotEmpty()
    @IsString() 
    readonly endDate: Date;


    @ApiProperty({
        example: 'Name example ...',
        description: 'Name  of Session',
        format: 'string',
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        example: 'Description example ...',
        description: 'Description of the Session',
        format: 'string',
    }) 
     description: string;

     @ApiProperty({
        example: 'LimitTicket ... 1500000',
        description: 'Total number of ticket which will be generated for the session',
        format: 'number',
    }) 
    @IsNotEmpty()
    @IsNumber()
    readonly limitTicket: number;  
    
}
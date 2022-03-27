import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateTicketDto {
    @ApiModelProperty({
        example: 'Example Title',
        description: 'Title of ticket',
        format: 'string',
        minLength: 6,
        maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly title: string;


    @ApiModelProperty({
        example: 'Body exmaple ...',
        description: 'Main part of ticket',
        format: 'string',
    })
    @IsNotEmpty()
    @IsString()
    readonly body: string;
}
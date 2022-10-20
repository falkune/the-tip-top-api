import { IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserLocationDto {
    @ApiProperty({
        description: 'the location information of thr user',
        format: 'Object',
       
      })
 
    @IsObject()
    readonly userLocation: object;

    @ApiProperty({
      example: '456457724HB78V245VB5KP272',
      description: 'Identifier of the user',
      format: 'number',
  })  
  @IsString()
  readonly userId: string; 
}

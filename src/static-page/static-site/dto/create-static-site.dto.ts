import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateStaticSiteDto {

  uuid?: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

}

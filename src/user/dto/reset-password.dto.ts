import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserInformationDto } from 'src/user-information/dto/user-information.dto';
export class ResetPasswordDto {
 
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `username ${Date.now()}` })
  uuid: string;

}

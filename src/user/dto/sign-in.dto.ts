import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `input${Date.now()}` })
  input: string;

  

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `123123` })
  password: string;
}

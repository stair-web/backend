import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SignInDto {
  @ValidateIf(v => (!v.email || v.username))
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `username_${Date.now()}` })
  username: string;

  @ValidateIf(v => (!v.username || v.email))
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `123123` })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CheckExistsUserDto {
  @ValidateIf((v) => !v.email || v.username)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `username_${Date.now()}` })
  username: string = undefined;

  @ValidateIf((v) => !v.username || v.email)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
  email: string = undefined;

  constructor(params?) {
    if (params) {
      console.log(params);
      
      for (let key in this) {
        this[key] = params[key];
      }
    }
  }
}

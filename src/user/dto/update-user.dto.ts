import { ApiProperty } from '@nestjs/swagger';
import { bool } from 'aws-sdk/clients/signer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
  email: string;

  @ApiProperty({ default: `123123` })
  password: string;
}

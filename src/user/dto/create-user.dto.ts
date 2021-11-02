import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `user ${Date.now()}` })
  username: string;

  @IsString()
  password: string;

  @IsString()
  profilePhotoKey: string;

  @IsString()
  personalEmail: string;

  /* USER INFORMATION */
  @IsString()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  phoneNumber: string;

  dob: Date;

  @IsString()
  position: string;

  @IsString()
  staffId: string;
}

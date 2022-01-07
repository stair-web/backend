import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserInformationDto } from 'src/user-information/dto/user-information.dto';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `username ${Date.now()}` })
  username: string;

  password: string;

  teamId: number;

  /* USER INFORMATION */
  @ApiProperty({
    default: {
      firstName: `firstName_${Date.now()}`,
      lastName: `lastName_${Date.now()}`,
      profilePhotoKey: 'https://picsum.photos/200',
      phoneNumber: '+841234567890',
      position: 'tester',
      shortDescription: 'this is a demo user short description',
      dob: '1995-01-01',
      isActive: true
    },
  })
  userInformation: UserInformationDto;
}

import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserInformationDto {

  /* USER INFORMATION */
  uuid: string;

  @ApiProperty({ default: `firstName_${Date.now()}` })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `lastName_${Date.now()}` })
  lastName: string;
  
  @ApiProperty({ default: `https://picsum.photos/200` })
  profilePhotoKey: string;

  @IsPhoneNumber()
  @ApiProperty({ default: `+841234567890` })
  phoneNumber: string;

  @ApiProperty({ default: `+841234567890` })
  dob: Date;
  
  @ApiProperty({ default: `+841234567890` })
  startDate: Date;

  @ApiProperty({ default: `tester` })
  position: string;

  @ApiProperty({ default: `+841234567890` })
  shortDescription: string;

  @ApiProperty({ default: `true` })
  isActive: string;

}

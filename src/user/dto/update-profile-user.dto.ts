import { ApiProperty } from '@nestjs/swagger';
import { UserInformationDto } from 'src/user-information/dto/user-information.dto';

export class UpdateProfileUserDto {
  // @ApiProperty({ default: `email_${Date.now()}@ari.com.vn` })
  // email: string;

  // @ApiProperty({ default: `123123` })
  // password: string;

  /* USER INFORMATION */
  @ApiProperty({


    default: {
      lastName: `lastName_${Date.now()}`,
      profilePhotoKey: 'https://picsum.photos/200',
      phoneNumber: '+841234567890',
      // position: 'tester',
      shortDescription: 'this is a demo user short description',
      dob: '1995-01-01',
    },
  })
  userInformation: UserInformationDto;
}


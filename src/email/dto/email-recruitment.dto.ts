import { IsNotEmpty, IsEmail } from 'class-validator';

export class EmailRecruitmentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  privateEmail: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  address: string;

  resume: any;

  activeLink: any;
}

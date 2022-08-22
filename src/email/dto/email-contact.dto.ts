import { IsNotEmpty, IsEmail } from 'class-validator';

export class EmailContactDto {
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
  message: string;

}

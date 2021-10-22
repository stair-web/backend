import { IsNotEmpty, IsEmail } from 'class-validator';

export class EmailCreateAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;


  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  fullname: string;
}

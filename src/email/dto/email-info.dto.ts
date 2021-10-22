import { IsNotEmpty, IsEmail } from 'class-validator';

export class EmailInfoDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  password?: string;

  @IsNotEmpty()
  token: string;

  username?: string;
}

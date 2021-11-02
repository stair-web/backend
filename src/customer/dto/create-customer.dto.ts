import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  note: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  sendTime: Date;
}

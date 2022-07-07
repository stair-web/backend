import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

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
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  sendTime: Date;
}

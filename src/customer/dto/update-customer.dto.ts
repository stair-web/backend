import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateCustomerDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  note: string;

  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phoneNumber: string;

  sendTime: Date;
}

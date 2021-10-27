import {
    IsNotEmpty,
    IsString,
} from 'class-validator';


export class CreateCustomerDto {
    @IsString()
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


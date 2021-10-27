import {
    IsNotEmpty,
    IsString,
} from 'class-validator';


export class UpdateCustomerDto {

    @IsString()
    @IsNotEmpty()
    id: string;

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


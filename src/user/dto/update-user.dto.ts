import { bool } from 'aws-sdk/clients/signer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    IsBoolean,
} from 'class-validator';


export class UpdateUserDto {
    @IsString()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    dob: Date;

    @IsString()
    position: string;

    @IsBoolean()
    isDeleted: bool;

    @IsString()
    personalEmail: string;

    @IsString()
    profilePhotoKey: string;

}

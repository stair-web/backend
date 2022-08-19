import { IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateRecruitmentDto {
    @ApiProperty()
    @IsString()
    uuid: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    email: string;
    
    @ApiProperty()
    @IsPhoneNumber('VN')
    phoneNumber: string;
    
    @ApiProperty()
    @IsString()
    position: string;
    
    @ApiProperty()
    // @IsString()
    resumeFile: string;

    @ApiProperty()
    @IsString()
    address: string;
}
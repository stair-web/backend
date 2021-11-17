import { IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateCandidateDto {
    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsString()
    privateEmail: string;

    @ApiProperty()
    @IsPhoneNumber('VN')
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    experience: string;

    @ApiProperty()
    @IsString()
    highestEducation: string;

    @ApiProperty()
    @IsString()
    university: string;

    @ApiProperty()
    @IsString()
    courseOfStudy: string;

    @ApiProperty()
    @IsString()
    websiteUrl: string;

    @ApiProperty()
    @IsString()
    informationChannel: string;

    @ApiProperty()
    @IsString()
    note: string;

    // @ApiProperty()
    // @IsString()
    // resumeFile: string;

    // @ApiProperty()
    // @IsString()
    // coverLetterFile: string;

}

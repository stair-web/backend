import { IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCandidateDto } from './create-candidate.dto';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
    @ApiProperty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsString()
    privateEmail: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    experience:string;

    @ApiProperty()
    highestEducation:string;

    @ApiProperty()
    university:string;

    @ApiProperty()
    courseOfStudy:string;

    @ApiProperty()
    websiteUrl:string;

    @ApiProperty()
    informationChannel:string;

    @ApiProperty()
    note:string;

}

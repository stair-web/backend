import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class UpdatePartnerPartnershipDto {
    @ApiProperty()
    @IsString()
    uuid: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    language: string;

    @ApiProperty()
    @IsBoolean()
    isDeleted: boolean;
}

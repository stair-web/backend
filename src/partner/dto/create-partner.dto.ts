import { CreatePartnerSectionItemDto } from './../../partner-section-item/dto/create-partner-section-item.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePartnerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    urlLogo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    introDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    introTitle: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    partershipDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    partershipTitle: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    partershipImgUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    sectionItemTitle: string;

    @ApiProperty({type: CreatePartnerSectionItemDto, isArray: true })
    partnerSectionItemList:CreatePartnerSectionItemDto[];
}

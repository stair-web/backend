import { UpdatePartnerPartnershipDto } from './../../partner-partnership/dto/update-partner-partnership.dto';
import { UpdatePartnerIntroductionDto } from './../../partner-introduction/dto/update-partner-introtrudction.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UpdatePartnerSectionItemDto } from 'src/partner-section-item/dto/update-partner-section-item.dto';
import { PartnerType } from '../enum/TypePartner.enum';
import { CreatePartnerDto } from './create-partner.dto';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
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

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    partnerType: PartnerType;

    @ApiProperty({type: UpdatePartnerSectionItemDto, isArray: true })
    partnerSectionItemList:UpdatePartnerSectionItemDto[];

    @ApiProperty({type: UpdatePartnerIntroductionDto, isArray: true })
    partnerInstroductionList:UpdatePartnerIntroductionDto[];

    @ApiProperty({type: UpdatePartnerPartnershipDto, isArray: true })
    partnerPartnershipList:UpdatePartnerPartnershipDto[];
}

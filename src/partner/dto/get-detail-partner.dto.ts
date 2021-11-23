import { CreatePartnerSectionItemDto } from '../../partner-section-item/dto/create-partner-section-item.dto';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GetDetailPartnerSectionItemDto } from 'src/partner-section-item/dto/get-detail-partner-section-item.dto';
import { PartnerUuidEnum } from '../enum/PartnerUuidEnum';
export class GetDetailPartnerDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  @IsString()
  urlLogo: string;

  @ApiProperty()
  @IsString()
  introDescription: string;

  @ApiProperty()
  @IsString()
  introTitle: string;

  @ApiProperty()
  @IsString()
  partershipDescription: string;

  @ApiProperty()
  @IsString()
  partershipTitle: string;

  @ApiProperty()
  @IsString()
  partershipImgUrl: string;

  @ApiProperty()
  @IsString()
  sectionItemTitle: string;

  @ApiProperty({ type: GetDetailPartnerSectionItemDto, isArray: true })
  partnerSectionItemList: GetDetailPartnerSectionItemDto[];
}

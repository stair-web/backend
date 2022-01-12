import { CreatePartnerSectionItemDto } from '../../partner-section-item/dto/create-partner-section-item.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PartnerType } from '../enum/TypePartner.enum';
import { LanguagerPartnerEnum } from '../enum/LanguagePartner.enum';
import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';

export class GetDetailParterByType {
  @ApiProperty({ enum: LanguageTypeEnum })
  language: LanguageTypeEnum;

}

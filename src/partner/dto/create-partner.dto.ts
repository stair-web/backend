import { CreatePartnerSectionItemDto } from './../../partner-section-item/dto/create-partner-section-item.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PartnerType } from '../enum/TypePartner.enum';

export class CreatePartnerDto {
   

    @ApiProperty({enum:PartnerType})
    @IsString()
    @IsNotEmpty()
    partnerType: PartnerType;
}

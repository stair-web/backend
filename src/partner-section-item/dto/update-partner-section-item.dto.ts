import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';
import { CreatePartnerSectionItemDto } from './create-partner-section-item.dto';

export class UpdatePartnerSectionItemDto extends PartialType(CreatePartnerSectionItemDto) {
    @ApiProperty()
    @IsString()
    uuid: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    imgUrl: string;

    @ApiProperty()
    @IsBoolean()
    isDeleted: boolean;
}

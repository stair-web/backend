import { StaticItemDto } from "src/static-page/static-item/dto/static-item.dto";
import { StaticSectionDto } from "src/static-page/static-section/dto/static-section.dto";
import { isNullOrUndefined } from "src/common/utils/common.util";
import { ApiProperty } from "@nestjs/swagger";

export class StaticPageDto {
    id?: number;

    @ApiProperty({default:"uuid"})
    uuid: string = undefined;

    @ApiProperty({default:"title updated by UpdateStaticPage"})
    title: string = undefined;

    @ApiProperty()
    item: StaticItemDto = undefined;
    
    @ApiProperty()
    sections: StaticSectionDto[] = undefined;
}
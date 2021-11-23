import { StaticItemDto } from "src/static-page/static-item/dto/static-item.dto";
import { StaticSectionDto } from "src/static-page/static-section/dto/static-section.dto";
import { isNullOrUndefined } from "src/common/utils/common.util";

export class StaticPageDto {
    id?: number;
    uuid: string = undefined;
    title: string = undefined;
    isDeleted?: boolean = undefined;
    createdAt?: Date = undefined;
    updatedAt?: Date = undefined;
    item: StaticItemDto = undefined;
    sections: StaticSectionDto[] = undefined;
}
import { StaticItemDto } from "src/static-page/static-item/dto/static-item.dto";
import { StaticSectionDto } from "src/static-page/static-section/dto/static-section.dto";
import { isNullOrUndefined } from "src/common/utils/common.util";

export class StaticPageDto {
    uuid: string = undefined;
    title: string = undefined;
    isDeleted?: boolean = undefined;
    createdAt?: Date = undefined;
    updatedAt?: Date = undefined;
    item: StaticItemDto = undefined;
    sections: StaticSectionDto[] = undefined;

    constructor(params?) {
        for (let key in this) {
            if (!isNullOrUndefined(params[key])) {
                this[key] = params[key];
            }
        }
    }
}
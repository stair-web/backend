import { StaticSectionDto } from "src/static-page/static-section/dto/static-section.dto";
import { isNullOrUndefined } from "src/common/utils/common.util";
import { StaticItem } from "src/static-page/static-item/static-item.entity";
import { StaticSection } from "src/static-page/static-section/static-section.entity";

export class StaticPageResponseDto {
    id?: number;
    uuid: string = undefined;
    title: string = undefined;
    isDeleted?: boolean = undefined;
    createdAt?: Date = undefined;
    updatedAt?: Date = undefined;
    item: StaticItem = undefined;
    sections: StaticSection[] = undefined;

    constructor(params?) {
        for (let key in this) {
            if (!isNullOrUndefined(params[key])) {
                this[key] = params[key];
            }
        }
    }
}
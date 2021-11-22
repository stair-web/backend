import { StaticItemDto } from "src/static-page/static-item/dto/static-item.dto";

export class StaticSectionDto {
    uuid: string;
    title: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    items: StaticItemDto[];
}
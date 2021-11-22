export class StaticItemDto {
    uuid: string;
    title: string;
    url: string;
    description: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
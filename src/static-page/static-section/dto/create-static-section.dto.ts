import { IsString } from 'class-validator';
import { title } from 'process';
export class CreateStaticSectionDto {
    @IsString()
    title;

    id;

    staticItemList:any;
}

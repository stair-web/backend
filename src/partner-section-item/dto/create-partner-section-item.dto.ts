import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePartnerSectionItemDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    imgUrl: string;

    @ApiProperty()
    @IsString()
    language: string;
}

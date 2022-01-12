import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetDetailPartnerPartnershipDto {
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
    @IsString()
    language: string;
}

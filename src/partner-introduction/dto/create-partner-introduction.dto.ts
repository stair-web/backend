import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePartnerIntroductionDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsString()
    language: string;
    
    @ApiProperty()
    @IsString()
    description: string;
}

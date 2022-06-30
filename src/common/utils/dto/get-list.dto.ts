import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetListDto {
  // @IsNumber()
  // @IsNotEmpty()
  @ApiProperty()
  page: number;

  // @IsNumber()
  // @IsNotEmpty()
  @ApiProperty()
  perPage: number;

  @ApiProperty({required: false})
  filter?: string;

  @ApiProperty({required: false})
  sort?: string;

  @ApiProperty({required: false})
  fullTextSearch?: string;
}

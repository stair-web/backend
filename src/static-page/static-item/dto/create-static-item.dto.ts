import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStaticItemDto {
  uuid?: string;

  @ApiProperty({ default: `title item ${Date.now()}` })
  title;

  @ApiProperty({
    default: `https://picsum.photos/200/300`,
  })
  url: string;

  @ApiProperty({ default: `description ${Date.now()}` })
  description: string;

}

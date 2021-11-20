import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStaticItemDto {
  uuid?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `title item ${Date.now()}` })
  title;

  @ApiProperty({
    default: `https://images.unsplash.com/photo-1542294670-01c195975f69?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=580&q=80`,
  })
  url: string;

  @ApiProperty({ default: `description ${Date.now()}` })
  description: string;

}

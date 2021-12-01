import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { title } from 'process';
export class CreateStaticSectionDto {
  uuid?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `title section ${Date.now()}` })
  title;

  @IsNotEmpty()
  @ApiProperty({enum:LanguageTypeEnum})
  language;

  staticItemList?;
}

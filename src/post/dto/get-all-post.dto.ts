import { LanguageTypeEnum } from './../../common/enum/language-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SortValue } from '../../common/sort-value.enum';

export class filterPostDto {
  title?: string;
  shortDescription?: string;
  dateTime?: Date;
  priority?: string;
  status?: string;
  category?: string;
  topic?: string;
}
export class sortPostDto {
  title?: SortValue;
  shortDescription?: SortValue;
  dateTime?: SortValue;
  priority?: SortValue;
  status?: SortValue;
  category?: SortValue;
  topic?: SortValue;
}
export class GetAllPostDto {
  @ApiProperty({default:9})
  perPage?: number;

  @ApiProperty({default:1})
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  filter?: filterPostDto;

  @ApiProperty()
  sorts?: sortPostDto;

  @ApiProperty({enum:LanguageTypeEnum})
  language?: LanguageTypeEnum;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SortValue } from '../../common/sort-value.enum';

export class filterPostDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  shortDescription?: string;
  @ApiProperty()
  dateTime?: Date;
  @ApiProperty()
  priority?: string;
  @ApiProperty()
  status?: string;
  @ApiProperty()
  category?: string;
  @ApiProperty()
  topic?: string;
}
export class sortPostDto {
  @ApiProperty()
  title?: SortValue;
  @ApiProperty()
  shortDescription?: SortValue;
  @ApiProperty()
  dateTime?: SortValue;
  @ApiProperty()
  priority?: SortValue;
  @ApiProperty()
  status?: SortValue;
  @ApiProperty()
  category?: SortValue;
  @ApiProperty()
  topic?: SortValue;
}
export class GetAllPostDto {
  @ApiProperty()
  @IsNotEmpty()
  perPage?: number;

  @ApiProperty()
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  filter?: filterPostDto;

  @ApiProperty()
  sorts?: sortPostDto;
}

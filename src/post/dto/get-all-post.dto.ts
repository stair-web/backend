import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SortValue } from '../../common/sort-value.enum';

export class GetAllPostDto {
  @ApiProperty()
  @IsNotEmpty()
  perPage?: number;

  @ApiProperty()
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  filter?: {
    title?: string;

    shortDescription?: string;

    dateTime?: Date;

    priority?: string;

    status?: string;

    category?: string;

    topic?: string;
  };

  @ApiProperty()
  sorts?: {
    title?: SortValue;

    shortDescription?: SortValue;

    dateTime?: SortValue;

    priority?: SortValue;

    status?: SortValue;

    category?: SortValue;

    topic?: SortValue;
  };
}

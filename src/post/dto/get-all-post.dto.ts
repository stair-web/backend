import { SortValue } from '../../common/sort-value.enum';

export class GetAllPostDto {
  perPage?: number;

  page: number;

  filter?: {
    title?: string;

    shortDescription?: string;

    dateTime?: Date;

    priority?: string;

    status?: string;

    category?: string;

    topic?: string;
  };

  sorts?: {
    title?: SortValue;

    shortDescription?: SortValue;

    dateTime?: SortValue;

    priority?: SortValue;

    status?: SortValue;

    category?: SortValue;

    topic?: SortValue;
  };

  fullTextSearch?: string;
}

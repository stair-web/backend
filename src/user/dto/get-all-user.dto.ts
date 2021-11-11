import { SortValue } from '../../common/sort-value.enum';

export class GetAllUserDto {
  perPage?: number;

  page = 0;

  filter?: {
    name?: string;

    username?: string;

    email?: string;
  };

  sorts?: {
    name?: SortValue;

    username?: SortValue;

    email?: SortValue;

    isActive?: SortValue;
  };

  fullTextSearch?: string;
}

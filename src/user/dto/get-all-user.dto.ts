import { SortValue } from '../../common/sort-value.enum';

export class GetAllUserDto {
  perPage?: number;

  page: number;

  filter?: {
    name?: string;

    username?: string;

    email?: string;
  };

  sorts?: {
    name?: SortValue;

    username?: SortValue;

    email?: SortValue;

    mtRole?: SortValue;

    department?: SortValue;

    ward?: SortValue;

    isActive?: SortValue;
  };

  fullTextSearch?: string;
}

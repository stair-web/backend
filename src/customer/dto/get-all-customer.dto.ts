import { SortValue } from '../../common/sort-value.enum';

export class GetAllCustomerDto {
  perPage?: number;

  page: number;

  filter?: {
    note?: string;

    fullName?: string;

    email?: string;

    phoneNumber?: string;

    sendTime?: string;
  };

  sorts?: {
    note?: SortValue;

    fullName?: SortValue;

    email?: SortValue;

    phoneNumber?: SortValue;

    sendTime?: SortValue;

    isDeleted?: SortValue;
  };

  fullTextSearch?: string;
}

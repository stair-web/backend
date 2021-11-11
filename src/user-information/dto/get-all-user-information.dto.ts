import { UserInformationDto, UserInformationSortDto } from './user-information.dto';

export class GetAllUserInformationDto {
  perPage?: number;

  page = 0;

  filter?: UserInformationDto;

  sorts?: UserInformationSortDto;

  fullTextSearch?: string;
}

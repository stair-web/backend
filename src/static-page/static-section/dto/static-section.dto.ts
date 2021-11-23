import { isNullOrUndefined } from 'src/common/utils/common.util';
import { StaticItemDto } from 'src/static-page/static-item/dto/static-item.dto';

export class StaticSectionDto {
  id?: number;
  uuid: string;
  title: string;
  isDeleted?: boolean;
  items: StaticItemDto[];
}

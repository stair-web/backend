import { isNullOrUndefined } from 'src/common/utils/common.util';

export class StaticItemDto {
  uuid: string;
  title: string;
  url: string;
  description: string;
  isDeleted?: boolean;

  constructor(params?) {
    if (params) {
      this.map(params);
    }
  }

  map(params) {
    for (let key in this) {
      if (!isNullOrUndefined(params[key])) {
        this[key] = params[key];
      }
    }
  }
}

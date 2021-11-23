import { ApiProperty } from '@nestjs/swagger';
import { isNullOrUndefined } from 'src/common/utils/common.util';

export class StaticItemDto {
  id?: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  other: string;

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

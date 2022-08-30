import { SortValue } from '../../common/sort-value.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllUserDto {
  @ApiProperty({
    default: 10,
    required: false,
  })
  perPage?: number = 10;

  @ApiProperty({
    default: 1,
    required: false,
  })
  page?: number = 1;

  // filter?: {
  //   name?: string;

  //   username?: string;

  //   email?: string;
  // };

  //Filter

  @ApiProperty({ required: false })
  filterUserInformationlastName: string;

  // @ApiProperty({ required: false })
  // filterLastName: string;

  @ApiProperty({ required: false })
  filterUserInformationposition: string;

  @ApiProperty({ required: false })
  filterEmail: string;

  @ApiProperty({ required: false })
  filterUserInformationphoneNumber: string;

  @ApiProperty({ required: false })
  filter0: string;

  //Sort

  @ApiProperty({ required: false, enum: SortValue })
  sortName: SortValue;

  // @ApiProperty({ required: false, enum: SortValue })
  // sortLastName: SortValue;

  @ApiProperty({ required: false, enum: SortValue })
  sortPosition: SortValue;

  @ApiProperty({ required: false, enum: SortValue })
  sortEmail: SortValue;

  @ApiProperty({ required: false, enum: SortValue })
  sortPhoneNumber: SortValue;

  @ApiProperty({ required: false, enum: SortValue })
  sortIsActive: SortValue;

  // @ApiProperty({ required: false, enum: SortValue })
  // sortAddress: SortValue;

  // sorts?: {
  //   name?: SortValue;

  //   username?: SortValue;

  //   email?: SortValue;

  //   isActive?: SortValue;
  // };

  fullTextSearch?: string;
}

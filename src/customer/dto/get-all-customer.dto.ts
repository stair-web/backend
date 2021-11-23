import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, } from 'class-validator';
import { SortValue } from '../../common/sort-value.enum';

export class GetAllCustomerDto {
  @ApiProperty({
    default:10,
    required: false
  })
  perPage?: number;

  @ApiProperty({
    default:1,
    required: false
  }) 
  page?:number;

  

  @ApiProperty({required: false})
  filterNote:string;
  @ApiProperty({required: false})
  filterFullName:string;
  @ApiProperty({required: false})
  filterEmail:string;
  @ApiProperty({required: false})
  filterPhoneNumber:string;
  @ApiProperty({required: false})
  filterSendTime:string;

  @ApiProperty({required: false, enum: SortValue,})
  sortNote: SortValue;
  @ApiProperty({required: false,enum: SortValue, })
  sortFullName: SortValue;
  @ApiProperty({required: false,enum: SortValue, })
  sortEmail: SortValue;
  @ApiProperty({required: false,enum: SortValue, })
  sortPhoneNumber: SortValue;
  @ApiProperty({required: false,enum: SortValue, })
  sortSendTime: SortValue;



  fullTextSearch?: string;
 
}

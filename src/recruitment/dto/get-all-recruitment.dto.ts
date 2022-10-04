import { ApiProperty } from '@nestjs/swagger';
import { SortValue } from '../../common/sort-value.enum';

export class GetAllRecruitmentDto {
  @ApiProperty({
    default:10,
    required: false
  })
  perPage?: number = 10;

  @ApiProperty({
    default:1,
    required: false
  }) 
  page?:number = 1;

  
  //Filter

  @ApiProperty({required: false})
  filterFirstName:string;

  @ApiProperty({required: false})
  filterLastName:string;

  @ApiProperty({required: false})
  filterPosition:string;

  @ApiProperty({required: false})
  filterEmail:string;

  @ApiProperty({required: false})
  filterPhoneNumber:string;

  @ApiProperty({required: false})
  filterAddress:string;
 

  //Sort

  @ApiProperty({required: false,enum: SortValue, })
  sortFirstName: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortLastName: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortPosition: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortEmail: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortPhoneNumber: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortAddress: SortValue;
  

  fullTextSearch?: string;
}

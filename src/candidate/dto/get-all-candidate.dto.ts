import { ApiProperty } from '@nestjs/swagger';
import { SortValue } from '../../common/sort-value.enum';

export class GetAllCandidateDto {
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
  // @ApiProperty({required: false})
  // filterNote:string;

  @ApiProperty({required: false})
  filterFirstName:string;

  @ApiProperty({required: false})
  filterLastName:string;

  @ApiProperty({required: false})
  filterPosition:string;

  @ApiProperty({required: false})
  filterPrivateEmail:string;

  @ApiProperty({required: false})
  filterPhoneNumber:string;

  @ApiProperty({required: false})
  filterAddress:string;

  // @ApiProperty({required: false})
  // filterExperience:string;

  // @ApiProperty({required: false})
  // filterHighestEducation:string;

  // @ApiProperty({required: false})
  // filterUniversity:string;

  // @ApiProperty({required: false})
  // filterCourseOfStudy:string;

  // @ApiProperty({required: false})
  // filterWebsiteUrl:string;

  // @ApiProperty({required: false})
  // filterInformationChannel:string;
 

  //Sort
  // @ApiProperty({required: false, enum: SortValue,})
  // sortNote: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortFirstName: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortLastName: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortPosition: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortPrivateEmail: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortPhoneNumber: SortValue;

  @ApiProperty({required: false,enum: SortValue, })
  sortAddress: SortValue;

  // @ApiProperty({required: false,enum: SortValue, })
  // sortExperience: SortValue;

  // @ApiProperty({required: false,enum: SortValue, })
  // sortHighestEducation:SortValue;

  // @ApiProperty({required: false,enum: SortValue, })
  // sortUniversity:SortValue;

  // @ApiProperty({required: false,enum: SortValue, })
  // sortCourseOfStudy:SortValue;
  
  // @ApiProperty({required: false,enum: SortValue, })
  // sortWebsiteUrl:SortValue;
  
  // @ApiProperty({required: false,enum: SortValue, })
  // sortInformationChannel:SortValue;

  fullTextSearch?: string;
}

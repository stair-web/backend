import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SortValue } from '../../common/sort-value.enum';

export class filterCandidateDto {
  fullName?: string;
  privateEmail?: string;
  phoneNumber?: string;
  university?: string;
  courseOfStudy?: string;
  note?: string;
}
export class sortCandidateDto {
    fullName?: SortValue;
    privateEmail?: SortValue;
    phoneNumber?: SortValue;
    university?: SortValue;
    courseOfStudy?: SortValue;
    note?: SortValue;
}
export class GetAllCandidateDto {
  @ApiProperty({default:9})
  perPage?: number;

  @ApiProperty({default:1})
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  filter?: filterCandidateDto;

  @ApiProperty()
  sorts?: sortCandidateDto;
}

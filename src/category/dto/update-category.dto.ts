import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

  @IsString()
  @ApiProperty()
  categoryName: string;

  @IsString()
  @ApiProperty()
  isDeleted: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dateTime: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  priority: string;

  @IsString()
  @ApiProperty()
  imageSrc: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsBoolean()
  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  category: Category;

  @ApiProperty()
  topic: Topic;
}

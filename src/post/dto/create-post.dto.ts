import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

export class CreatePostDto {
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

  @ApiProperty()
  category: Category;

  @ApiProperty()
  topic: Topic;
}

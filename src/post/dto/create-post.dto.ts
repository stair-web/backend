import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  dateTime: Date;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  imageSrc: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  category: Category;

  topic: Topic;
}

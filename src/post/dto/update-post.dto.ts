import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  short_description: string;

  @IsString()
  @IsNotEmpty()
  date_time: Date;

  @IsString()
  @IsNotEmpty()
  priority: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  isDeleted: boolean;

  category: Category;

  topic: Topic;
}

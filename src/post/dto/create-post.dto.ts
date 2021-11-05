import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

export class CreatePostDto {

  // @IsUUID()
  uuid?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `Post ${Date.now()}` })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: `description ${Date.now()}` })
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: `content ${Date.now()}: What is Lorem Ipsum?
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
  })
  content: string;

  // @IsString()
  priority?: string;

  @IsString()
  @ApiProperty({
    default: `https://images.unsplash.com/photo-1542294670-01c195975f69?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=580&q=80`,
  })
  imageSrc?: string;

  // @IsString()
  status: string;

  @IsUUID()
  @ApiProperty()
  categoryUuid: string;

  // @IsString()
  topicUuid?: string;

  fileType: string;
}

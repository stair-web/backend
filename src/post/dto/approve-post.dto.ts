import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Topic } from 'src/topic/topic.entity';

export class ApprovePostDto {

  @IsUUID()
  @ApiProperty()
  uuid?: string;

  @ApiProperty()
  @IsBoolean()
  isApproved: boolean;
}

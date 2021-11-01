import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';

@ApiTags('Topic')
@Controller('topic')
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private connection: Connection,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách Topic thành công.',
  })
  @ApiOperation({ summary: 'Lấy danh sách Topic' })
  async getTopic() {
    return await this.connection.transaction((transactionManager) => {
      return this.topicService.getAll(transactionManager);
    });
  }
}

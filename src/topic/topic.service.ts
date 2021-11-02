import { TopicRepository } from './topic.repository';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  async getAll(transactionManager: EntityManager): Promise<unknown> {
    return await this.topicRepository.getAllTopic(transactionManager);
  }
}

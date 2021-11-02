import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Topic } from './topic.entity';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  async getAllTopic(transactionManager: EntityManager): Promise<unknown> {
    const query = transactionManager
      .getRepository(Topic)
      .createQueryBuilder('topic')
      .select([
        'topic.id',
        'topic.topicName',
        'topic.isDeleted',
        'topic.createdAt',
        'topic.updatedAt',
      ])
      .orderBy('topic.topicName', 'ASC')
      .andWhere('topic.isDeleted = FALSE');
    const data = await query.getMany();
    const total = await query.getCount();
    return { statusCode: 200, data: { data, total } };
  }
  catch(error) {
    Logger.error(error);
    throw new InternalServerErrorException(
      'Lỗi hệ thống trong quá trình lấy danh sách Topic, vui lòng thử lại sau.',
    );
  }
}

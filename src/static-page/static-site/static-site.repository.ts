import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { StaticSite } from './static-site.entity';

@EntityRepository(StaticSite)
export class StaticSiteRepository extends Repository<StaticSite> {

  /**
   * 
   * @param transactionManager 
   * @param createStaticSite 
   * @returns 
   */
  async createStaticSite(
    transactionManager: EntityManager,
    createStaticSite: CreateStaticSiteDto,
  ) {
    const staticSite = transactionManager.create(StaticSite, createStaticSite);

    try {
      await transactionManager.save(staticSite);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  
}

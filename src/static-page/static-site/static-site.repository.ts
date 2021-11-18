import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { StaticSectionRepository } from 'src/static-section/static-section.repository';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { StaticSite } from './static-site.entity';

@EntityRepository(StaticSite)
export class StaticSiteRepository extends Repository<StaticSite> {
  async createStaticSite(
    transactionManager: EntityManager,
    createStaticSite: CreateStaticSiteDto,
  ) {
    const { title, uuid } = createStaticSite;
    // const staticStie = {
    //   uuid,
    //   title,
    //   isDeleted: false,
    //   updatedAt: new Date(),
    //   createdAt: new Date(),
    //   staticSectionList: createStaticSite.listSection,
    // };
    try {
     
     const staticStie =   await transactionManager.create(StaticSite, {
        uuid:uuidv4(),
      title,
      isDeleted: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      staticSectionList: createStaticSite.listSection,
      });;
      console.log(staticStie.staticSectionList[0]);
      
      await transactionManager.save(staticStie);

      return { statusCode: 201, description: 'Tạo Static Site thành công' };
    } catch (error) {
      console.log(error);
    }
  }
}

import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { throws } from 'assert';
import { uuidv4 } from 'src/common/util/common.util';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { StaticSectionRepository } from 'src/static-section/static-section.repository';
import { EntityManager } from 'typeorm';
import { CreateStaticSiteDto } from './dto/create-static-site.dto';
import { UpdateStaticSiteDto } from './dto/update-static-site.dto';
import { StaticSite } from './static-site.entity';
import { StaticSiteRepository } from './static-site.repository';

@Injectable()
export class StaticSiteService {
 
  constructor(private staticRepository: StaticSiteRepository,
    private sectionRepo: StaticSectionRepository) {}
  async  getStaticSite(transactionManager: EntityManager, id: any): Promise<unknown> {
    return  await   transactionManager.getRepository(StaticSite).findOne(id,{relations:['staticSectionList']})
    }
  async createStaticSite(
    transactionManager: EntityManager,
    createStaticSite: CreateStaticSiteDto,
  ): Promise<unknown> {
    //check duplicate
    // const staticSite = await transactionManager
    //     .getRepository(StaticSite)
    //     .findOne({ title: createStaticSite.title, isDeleted: false });
    //   createStaticSite.uuid = uuidv4();
    //   if (!isNullOrUndefined(staticSite)) {
    //     throw new ConflictException(
    //       `Static Site '${createStaticSite.title}' đã tồn tại, vui lòng chọn tên khác`,
    //     );
    //   }
      
    try {
      const listSection = await this.sectionRepo.saveListSection(
        transactionManager,
        createStaticSite.listSection,
      );
      
      createStaticSite.listSection = listSection;
      
      return await this.staticRepository.createStaticSite(
        transactionManager,
        createStaticSite,
      );
    } catch (error) {
      console.log(error);
      Logger.error(error);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong quá trình tạo Static Site.`,
      );
    }
  }
}

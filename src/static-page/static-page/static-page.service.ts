import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isUuid } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { StaticSite } from '../static-site/static-site.entity';
import { StaticPageDto } from './dto/static-page.dto';

@Injectable()
export class StaticPageService {
  /**
   *
   * @param transactionManager
   * @param uuid
   */
  async getPageByUuid(transactionManager: EntityManager, uuid: string) {
    if (!isUuid(uuid)) {
      throw new InternalServerErrorException(
        'Site Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    const site = await transactionManager
    .getRepository(StaticSite)
    .findOne({ uuid });
    let staticPage = new StaticPageDto(site);
    
  }
}

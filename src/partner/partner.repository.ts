import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { uuidv4 } from 'src/common/util/common.util';
import { Partner } from './partner.entity';

@EntityRepository(Partner)
export class PartnerRepository extends Repository<Partner> {
  async getDetailPartner(transactionManager: EntityManager, uuid: string) {
   return await transactionManager.getRepository(Partner).createQueryBuilder('partner')
    .leftJoin("partner.partnerSectionItemList", "partnerSectionItem",'partnerSectionItem.isDeleted = :isDeleted', { isDeleted: 'false' })
    .select([
      'partner.uuid',
      'partner.createdAt',
      'partner.updatedAt',
      'partner.urlLogo',
      'partner.introDescription',
      'partner.introTitle',
      'partner.partershipDescription',
      'partner.partershipTitle',
      'partner.partershipImgUrl',
      'partner.sectionItemTitle',
      'partnerSectionItem.uuid',
      'partnerSectionItem.title',
      'partnerSectionItem.imgUrl',
    ])
    .where(`partner.uuid = :uuid`, { uuid })
    .andWhere('partner.isDeleted = :isDeleted', { isDeleted: 'false' })
  .getOne();
  }
  
}

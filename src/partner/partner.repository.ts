import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { LanguageTypeEnum } from 'src/common/enum/language-type.enum';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { LanguagerPartnerEnum } from './enum/LanguagePartner.enum';
import { PartnerType } from './enum/TypePartner.enum';
import { Partner } from './partner.entity';

@EntityRepository(Partner)
export class PartnerRepository extends Repository<Partner> {
  async getDetailPartnerByUuid(transactionManager: EntityManager, uuid: string) {
      return await transactionManager.getRepository(Partner).createQueryBuilder('partner')
    .leftJoin("partner.partnerSectionItemList", "partnerSectionItem",'partnerSectionItem.isDeleted = :isDeleted', { isDeleted: 'false' })
    .leftJoin("partner.partnerInstroductionList", "partnerInstroduction",'partnerInstroduction.isDeleted = :isDeleted', { isDeleted: 'false' })
    .leftJoin("partner.partnerPartnershipList", "partnerPartnership",'partnerPartnership.isDeleted = :isDeleted', { isDeleted: 'false' })
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
      'partnerSectionItem.language',

      'partnerInstroduction.uuid',
      'partnerInstroduction.title',
      'partnerInstroduction.url',
      'partnerInstroduction.language',
      'partnerInstroduction.description',
      'partnerInstroduction.isDeleted',

      'partnerPartnership.uuid',
      'partnerPartnership.title',
      'partnerPartnership.url',
      'partnerPartnership.language',
      'partnerPartnership.description',
      'partnerPartnership.isDeleted',

    ])
    .where(`partner.uuid = :uuid`, { uuid })
    .andWhere('partner.isDeleted = :isDeleted', { isDeleted: 'false' })
  .getOne();
   
  }
  async getDetailPartnerByType(transactionManager: EntityManager, type: PartnerType, language:LanguageTypeEnum) {
    try {
      let data =  await transactionManager.getRepository(Partner).createQueryBuilder('partner')
    .leftJoin("partner.partnerSectionItemList", "partnerSectionItem",'partnerSectionItem.isDeleted = :isDeleted', { isDeleted: 'false' })
    .leftJoin("partner.partnerInstroductionList", "partnerInstroduction",'partnerInstroduction.isDeleted = :isDeleted', { isDeleted: 'false' })
    .leftJoin("partner.partnerPartnershipList", "partnerPartnership",'partnerPartnership.isDeleted = :isDeleted', { isDeleted: 'false'})
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
      'partnerSectionItem.language',

      'partnerInstroduction.uuid',
      'partnerInstroduction.title',
      'partnerInstroduction.url',
      'partnerInstroduction.language',
      'partnerInstroduction.description',
      'partnerInstroduction.isDeleted',

      'partnerPartnership.uuid',
      'partnerPartnership.title',
      'partnerPartnership.url',
      'partnerPartnership.language',
      'partnerPartnership.description',
      'partnerPartnership.isDeleted',

    ])
    .where(`partner.partnerType = :type`, { type:type })
    .andWhere('partner.isDeleted = :isDeleted', { isDeleted: 'false' })
  .getOne();
    
      if(data){
        
        if(language !== 'all'){
          data.partnerInstroductionList =  data.partnerInstroductionList.filter(ele=>ele.language === language);
          data.partnerPartnershipList =  data.partnerPartnershipList.filter(ele=>ele.language === language);
          data.partnerSectionItemList =  data.partnerSectionItemList.filter(ele=>ele.language === language);
        }
      }
      return data;
    } catch (error) {
      
    }
   
  }
}

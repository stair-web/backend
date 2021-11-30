import { PartnerPartnership } from './../partner-partnership/partner-partnership.entity';
import { PartnerIntroduction } from './../partner-introduction/partner-introduction.entity';
import { PartnerRepository } from './partner.repository';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { PartnerSectionItem } from 'src/partner-section-item/partner-section-item.entity';
import { EntityManager } from 'typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './partner.entity';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { LanguagerPartnerEnum } from './enum/LanguagePartner.enum';
import { PartnerType } from './enum/TypePartner.enum';
import { GetDetailParterByType } from './dto/get-detail-partner-by-type.dto';

@Injectable()
export class PartnerService {
  constructor(private partnerRepository: PartnerRepository) {}
  async getDetailPartnerByType(transactionManager: EntityManager, type: PartnerType,language:LanguagerPartnerEnum) {
    console.log(123123123);
    
    let data = await this.partnerRepository.getDetailPartnerByType(
      transactionManager,
      type,
      language,
    );
    return {
      statusCode: 201,
      data: data,
    };
  }
  async deletePartner(transactionManager: EntityManager, uuid: string) {
    try {
      let partner = await transactionManager
        .getRepository(Partner)
        .findOne({ uuid });
      if (isNullOrUndefined(partner)) {
        throw new ConflictException('Ứng viên không tồn tại!');
      }
      partner.isDeleted = true;
      partner.partnerType = PartnerType.Unknown;
      partner.updatedAt = new Date();
      partner.partnerSectionItemList.forEach((ele) => {
        ele.isDeleted = true;
      });
      await transactionManager.getRepository(PartnerSectionItem).save(partner);
      return {
        statusCode: 201,
        message: `Xoá Partner thành công.`,
      };
    } catch (error) {
      Logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình cập nhật, vui lòng thử lại sau.',
      );
    }
  }
  async updatePartner(
    transactionManager: EntityManager,
    updatePartnerDto: UpdatePartnerDto,
    uuid: string,
  ) {
    try {
      let partner = await transactionManager.getRepository(Partner).findOne({
        where: { uuid, isDeleted: false },
        relations: ['partnerSectionItemList','partnerInstroductionList','partnerPartnershipList'],
      });
      
      if (isNullOrUndefined(partner)) {
        throw new ConflictException('Ứng viên không tồn tại!');
      }
      (partner.urlLogo = updatePartnerDto.urlLogo),
        (partner.introDescription = updatePartnerDto.introDescription),
        (partner.introTitle = updatePartnerDto.introTitle),
        (partner.partershipDescription =
          updatePartnerDto.partershipDescription),
        (partner.partershipTitle = updatePartnerDto.partershipTitle),
        (partner.partershipImgUrl = updatePartnerDto.partershipImgUrl),
        (partner.sectionItemTitle = updatePartnerDto.sectionItemTitle),
        (partner.updatedAt = new Date());

      partner = await transactionManager.save(partner);

      //Section Item
      let listSaveSection = [];
      updatePartnerDto.partnerSectionItemList.forEach(async (ele) => {
        let item: PartnerSectionItem = new PartnerSectionItem();
        if (!ele.uuid) {
          item.uuid = uuidv4();
          item.title = ele.title;
          item.imgUrl = ele.imgUrl;
          item.partner = partner;
          item.language = ele.language;
          listSaveSection.push(item);
        } else {
          item = partner.partnerSectionItemList.find(
            (eleI) => eleI.uuid === ele.uuid,
          );
          if (!isNullOrUndefined(item)) {
            item.title = ele.title;
            item.imgUrl = ele.imgUrl;
            item.partner = partner;
            item.isDeleted = ele.isDeleted;
            item.updatedAt = new Date();
            item.language = ele.language;
            await transactionManager.save(item);
          }
        }
      });
      await transactionManager
        .getRepository(PartnerSectionItem)
        .save(listSaveSection);

      //Introduction
      let listSaveIntroduction = [];
      updatePartnerDto.partnerInstroductionList.forEach(async (ele) => {
        let item: PartnerIntroduction = new PartnerIntroduction();
        if (!ele.uuid) {
          item.uuid = uuidv4();
          item.title = ele.title;
          item.url = ele.url;
          item.description = ele.description;
          item.partner = partner;
          item.language = ele.language;
          listSaveIntroduction.push(item);
        } else {
          item = partner.partnerInstroductionList.find(
            (eleI) => eleI.uuid === ele.uuid,
          );
          if (!isNullOrUndefined(item)) {
            item.title = ele.title;
            item.url = ele.url;
            item.description = ele.description;
            item.partner = partner;
            item.isDeleted = ele.isDeleted;
            item.updatedAt = new Date();
            item.language = ele.language;
            await transactionManager.save(item);
          }
        }
      });
      await transactionManager
        .getRepository(PartnerIntroduction)
        .save(listSaveIntroduction);

      //Partnership
      let listSavePartnership = [];
      updatePartnerDto.partnerPartnershipList.forEach(async (ele) => {
        let item: PartnerPartnership = new PartnerPartnership();
        if (!ele.uuid) {
          item.uuid = uuidv4();
          item.title = ele.title;
          item.url = ele.url;
          item.description = ele.description;
          item.partner = partner;
          item.language = ele.language;
          listSavePartnership.push(item);
        } else {
          item = partner.partnerPartnershipList.find(
            (eleI) => eleI.uuid === ele.uuid,
          );
          if (!isNullOrUndefined(item)) {
            item.title = ele.title;
            item.url = ele.url;
            item.description = ele.description;
            item.partner = partner;
            item.isDeleted = ele.isDeleted;
            item.updatedAt = new Date();
            item.language = ele.language;
            await transactionManager.save(item);
          }
        }
      });
      await transactionManager
        .getRepository(PartnerPartnership)
        .save(listSavePartnership);

      return {
        statusCode: 201,
        message: `Cập nhật Partner thành công.`,
      };
    } catch (error) {
      Logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình cập nhật, vui lòng thử lại sau.',
      );
    }
  }

  async getDetailPartnerByUuid(transactionManager: EntityManager, uuid: string) {
    let data = await this.partnerRepository.getDetailPartnerByUuid(
      transactionManager,
      uuid,
    );    
    return {
      statusCode: 201,
      data: data,
    };
  }
  async createPartner(
    transactionManager: EntityManager,
    createPartnerDto: CreatePartnerDto,
  ) {
    try {

      let findParter = await transactionManager.getRepository(Partner).find({partnerType:createPartnerDto.partnerType });
      findParter.forEach(ele=>{
        ele.partnerType = PartnerType.Unknown;
      })

      let partner = await transactionManager.getRepository(Partner).create({
        uuid: uuidv4(),
        partnerType:createPartnerDto.partnerType
      });
      partner = await transactionManager.save(partner);
      
      let partnerSectionItem = await transactionManager
        .getRepository(Partner)
        .save(findParter);

      return {
        statusCode: 201,
        message: `Tạo Partner thành công.`,
      };
    } catch (error) {
      Logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình tạo, vui lòng thử lại sau.',
      );
    }
  }
}

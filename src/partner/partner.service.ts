import { PartnerRepository } from './partner.repository';
import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { uuidv4 } from 'src/common/utils/common.util';
import { PartnerSectionItem } from 'src/partner-section-item/partner-section-item.entity';
import { EntityManager } from 'typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './partner.entity';
import { isNullOrUndefined } from 'src/lib/utils/util';

@Injectable()
export class PartnerService {
  constructor(
    private partnerRepository:PartnerRepository,
  ){}
  async deletePartner(transactionManager: EntityManager, uuid: string) {
    try {
      let partner =  await transactionManager.getRepository(Partner).findOne({uuid});
    if(isNullOrUndefined(partner)){
      throw new ConflictException('Ứng viên không tồn tại!');
    }
    partner.isDeleted = true;
    partner.updatedAt = new Date();
    partner.partnerSectionItemList.forEach(ele=>{
      ele.isDeleted = true;
    })
    await  transactionManager.getRepository(PartnerSectionItem).save(partner);
    return {
      statusCode: 201,
      message: `Xoá Partner thành công.`,
    };
    }catch (error) {
      Logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá trình cập nhật, vui lòng thử lại sau.',
      );
     }
    
  }
  async updatePartner(transactionManager: EntityManager, updatePartnerDto: UpdatePartnerDto, uuid: string) {
    try {
      let partner =  await transactionManager.getRepository(Partner).findOne({where:{uuid, isDeleted:false},
        relations:['partnerSectionItemList']
      });
      if(isNullOrUndefined(partner)){
        throw new ConflictException('Ứng viên không tồn tại!');
      }          
           partner.urlLogo = updatePartnerDto.urlLogo,
           partner.introDescription = updatePartnerDto.introDescription,
           partner.introTitle = updatePartnerDto.introTitle,
           partner.partershipDescription = updatePartnerDto.partershipDescription,
           partner.partershipTitle = updatePartnerDto.partershipTitle,
           partner.partershipImgUrl = updatePartnerDto.partershipImgUrl,
           partner.sectionItemTitle = updatePartnerDto.sectionItemTitle,
          partner.updatedAt = new Date();
       
       partner =    await transactionManager.save(partner)
       let listSaveSection = [];
       
       updatePartnerDto.partnerSectionItemList.forEach(async ele=>{
         let item:PartnerSectionItem = new PartnerSectionItem;         
         if(!ele.uuid){
          item.uuid = uuidv4();
          item.title = ele.title;
          item.imgUrl = ele.imgUrl;
          item.partner = partner;
          listSaveSection.push(item);
         } else{
           
          item = partner.partnerSectionItemList.find(eleI=> eleI.uuid === ele.uuid);
          if(!isNullOrUndefined(item)){
            item.title = ele.title;
            item.imgUrl = ele.imgUrl;
            item.partner = partner;
            item.isDeleted = ele.isDeleted;
            item.updatedAt = new Date();
            
            await transactionManager.save(item);
          }
         }

       })
       
        await  transactionManager.getRepository(PartnerSectionItem).save(listSaveSection);
      //  console.log(listSaveSection);
      
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
 
  async getDetailPartner(transactionManager: EntityManager, uuid: string){
    let data = await this.partnerRepository.getDetailPartner(transactionManager,uuid)
    return {
      statusCode: 201,
      data: data,
    };
  }
  async createPartner(transactionManager: EntityManager, createPartnerDto: CreatePartnerDto) {
  
   try {
    
   let partner =  await transactionManager.getRepository(Partner).create(
      {
        uuid: uuidv4(),
        urlLogo:createPartnerDto.urlLogo,
        introDescription:createPartnerDto.introDescription,
        introTitle:createPartnerDto.introTitle,
        partershipDescription:createPartnerDto.partershipDescription,
        partershipTitle:createPartnerDto.partershipTitle,
        partershipImgUrl:createPartnerDto.partershipImgUrl,
        sectionItemTitle:createPartnerDto.sectionItemTitle,
      }
    )
    partner =    await transactionManager.save(partner)
    let listSaveSection = [];
    
    createPartnerDto.partnerSectionItemList.forEach(ele=>{
      let item:PartnerSectionItem = new PartnerSectionItem;
      item.uuid = uuidv4();
      item.title = ele.title;
      item.imgUrl = ele.imgUrl;
      item.partner = partner,
      listSaveSection.push(item);
    })
    let partnerSectionItem =  await  transactionManager.getRepository(PartnerSectionItem).save(listSaveSection);
    
   
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

import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { uuidv4 } from 'src/common/util/common.util';
import { StaticItem } from 'src/static-page/static-item/static-item.entity';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { StaticSection } from './static-section.entity';


@EntityRepository(StaticSection)
export class StaticSectionRepository extends Repository<StaticSection> {
  // async saveListSection(transactionManager: EntityManager,listSection: CreateStaticSectionDto[]) {
  //   try {

  //     const listSectionTrans:StaticSection[] = []
  //     listSection.forEach(section=>{
  //       let sectionTrans:StaticSection;
  //       if(section.id){
  //         sectionTrans = transactionManager.create(StaticSection,{
  //           uuid:uuidv4(),
  //           title:section.title,
  //           isDeleted:false,
  //           updatedAt:new Date(),
  //           createdAt:new Date(),
  //           staticItemList:[]
  //         })
  //       }else{
  //         sectionTrans = transactionManager.create(StaticSection,{
  //           id: section.id,
  //           uuid:uuidv4(),
  //           title:section.title,
  //           isDeleted:false,
  //           updatedAt:new Date(),
  //           createdAt:new Date(),
  //           staticItemList:[]

  //         })
  //       }

  //       section.staticItemList.forEach(async item=>{
  //         let itemTrans:StaticItem;
  //         if(item.id){
  //           itemTrans = transactionManager.create(StaticItem,{
  //             uuid:uuidv4(),
  //             title:item.title,
  //             isDeleted:false,
  //             updatedAt:new Date(),
  //             createdAt:new Date(),
  //             description:item.description,
  //             url:item.url,
  //           })
  //         }else{
  //           itemTrans = transactionManager.create(StaticItem,{
  //             id: item.id,
  //             uuid:uuidv4(),
  //             title:item.title,
  //             isDeleted:false,
  //             updatedAt:new Date(),
  //             createdAt:new Date(),
  //             description:item.description,
  //             url:item.url,
  //           })
  //         }       
          
  //        const itemSave = await transactionManager.getRepository(StaticItem).save(itemTrans);
         
  //         sectionTrans.staticItemList.push(itemSave)
  //       })
  //       listSectionTrans.push(sectionTrans);
  //     })
  //     const res =  await   transactionManager.getRepository(StaticSection).save(listSectionTrans);
  //       return res;
  //   } catch (error) {
      
  //    console.log(error);
  //    throw new InternalServerErrorException(
  //     `Lỗi hệ thống trong quá trình tạo Static Site.`,
  //   );
  //   }
  // }

}

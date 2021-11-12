import { StaticSectionRepository } from 'src/static-section/static-section.repository';
import { Injectable } from '@nestjs/common';
import { StaticItem } from 'src/static-item/static-item.entity';
import { EntityManager } from 'typeorm';
import { CreateStaticSectionDto } from './dto/create-static-section.dto';
import { UpdateStaticSectionDto } from './dto/update-static-section.dto';
import { StaticSection } from './static-section.entity';

@Injectable()
export class StaticSectionService {
    constructor(
        private staticSectionRepository:StaticSectionRepository,
    ){

    }
  async createStaticSite(transactionManager: EntityManager, createStaticSection: CreateStaticSectionDto): Promise<unknown> {
 try {
     return await this.staticSectionRepository.saveListSection(transactionManager,[createStaticSection]);
    const list =  await transactionManager.getRepository(StaticItem).save(createStaticSection.staticItemList);
    return await  transactionManager.getRepository(StaticSection).save(createStaticSection);

 } catch (error) {
     
     console.log(error);

 }
    
  }
 
}

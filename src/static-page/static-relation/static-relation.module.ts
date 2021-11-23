import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticItemRepository } from '../static-item/static-item.repository';
import { StaticPageController } from '../static-page/static-page.controller';
import { StaticPageService } from '../static-page/static-page.service';
import { StaticSectionRepository } from '../static-section/static-section.repository';
import { StaticSiteRepository } from '../static-site/static-site.repository';
import { StaticRelationController } from './static-relation.controller';
import { StaticRelationRepository } from './static-relation.repository';
import { StaticRelationService } from './static-relation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaticRelationRepository,
      StaticSiteRepository,
      StaticSectionRepository,
      StaticItemRepository,
    ]),
  ],
  controllers: [StaticRelationController, StaticPageController],
  providers: [StaticRelationService, StaticPageService],
})
export class StaticRelationModule {}

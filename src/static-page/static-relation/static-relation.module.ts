import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticPageController } from '../static-page/static-page.controller';
import { StaticPageService } from '../static-page/static-page.service';
import { StaticRelationController } from './static-relation.controller';
import { StaticRelationRepository } from './static-relation.repository';
import { StaticRelationService } from './static-relation.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([StaticRelationRepository]),
  ],
  controllers: [StaticRelationController, StaticPageController],
  providers: [StaticRelationService, StaticPageService]
})
export class StaticRelationModule {}

import { Module } from '@nestjs/common';
import { StaticSiteService } from './static-site.service';
import { StaticSiteController } from './static-site.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticSiteRepository } from './static-site.repository';
import { StaticSectionRepository } from 'src/static-section/static-section.repository';

@Module({
  imports: [    TypeOrmModule.forFeature([StaticSiteRepository,StaticSectionRepository]),
],
  controllers: [StaticSiteController],
  providers: [StaticSiteService]
})
export class StaticSiteModule {}

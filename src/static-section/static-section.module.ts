import { Module } from '@nestjs/common';
import { StaticSectionService } from './static-section.service';
import { StaticSectionController } from './static-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticSectionRepository } from './static-section.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([StaticSectionRepository]),
  ],
  controllers: [StaticSectionController],
  providers: [StaticSectionService]
})
export class StaticSectionModule {}

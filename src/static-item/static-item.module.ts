import { Module } from '@nestjs/common';
import { StaticItemService } from './static-item.service';
import { StaticItemController } from './static-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticItemRepository } from './static-item.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([StaticItemRepository,]),
  ],
  controllers: [StaticItemController],
  providers: [StaticItemService]
})
export class StaticItemModule {}

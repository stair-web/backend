import { Module } from '@nestjs/common';
import { StaticRelationService } from './static-relation.service';
import { StaticRelationController } from './static-relation.controller';

@Module({
  controllers: [StaticRelationController],
  providers: [StaticRelationService]
})
export class StaticRelationModule {}

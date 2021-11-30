import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { isNullOrUndefined, paramStringToJson } from 'src/lib/utils/util';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { PartnerSectionItem } from './partner-section-item.entity';

@EntityRepository(PartnerSectionItem)
export class PartnerSectionItemRepository extends Repository<PartnerSectionItem> {
  
}
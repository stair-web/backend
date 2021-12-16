/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DayoffRepository } from './dayoff.repository';
import { DayOffSearch } from './dto/dayoff-search.dto';

@Injectable()
export class DayoffService {
    constructor(
        private dayoffRepository: DayoffRepository,
    ) {

    }

    async getAllDayOffAdmin(
        transactionManager: EntityManager,
        dayOffSearch: DayOffSearch,) {
        return this.dayoffRepository.getAllDayOffAdmin(transactionManager, dayOffSearch);
      }
    
}

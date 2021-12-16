import { isNullOrUndefined } from 'src/lib/utils/util';
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { DayOff } from './dayoff.entity';
import { DayOffSearch } from './dto/dayoff-search.dto';

@EntityRepository(DayOff)
export class DayoffRepository extends Repository<DayOff> {

  async getAllDayOffAdmin(
    transactionManager: EntityManager,
    dayOffSearch: DayOffSearch,
  ) {
    const { page, dateFrom, dateTo, status, perPage } = dayOffSearch;

    const query = transactionManager
      .getRepository(DayOff)
      .createQueryBuilder('dayoff')
      .leftJoin('dayoff.staff', 'staff')
      .select(['dayoff', 'staff'])
      .where({ isDeleted: false })
      .take(perPage || 25)
      .skip((page - 1) * perPage || 0)
      .orderBy('dayoff.createdAt', 'DESC');

    // Full text search
    if (!isNullOrUndefined(status) && status !== '') {
      query.andWhere('LOWER(dayoff.status) LIKE LOWER(:status)', {
        status: status,
      });
    }

    if (!isNullOrUndefined(dateFrom) && !isNullOrUndefined(dateTo)) {
      query.andWhere('dayoff.dateLeave between :dateFrom and :dateTo', {
        dateFrom: dateFrom,
        dateTo: dateTo,
      });
    }

    try {
      const data = await query.getMany();
      const total = await query.getCount();
      return { statusCode: 201, data: { dayOffList: data, total } };
    } catch (error) {
      console.log(error);
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isNullOrUndefined, isUuid } from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { StaticItem } from '../static-item/static-item.entity';
import { StaticRelation } from '../static-relation/static-relation.entity';
import { StaticSection } from '../static-section/static-section.entity';
import { StaticSite } from '../static-site/static-site.entity';
import { StaticPageResponseDto } from './dto/static-page-response.dto';
import { StaticPageDto } from './dto/static-page.dto';

@Injectable()
export class StaticPageService {
  /**
   *
   * @param transactionManager
   * @param uuid
   */
  async getPageByUuid(transactionManager: EntityManager, uuid: string) {
    if (!isUuid(uuid)) {
      throw new InternalServerErrorException(
        'Site Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    try {
      const site = await transactionManager
        .getRepository(StaticSite)
        .findOne({ uuid });

      let staticPage = new StaticPageResponseDto(site);

      const siteRelations = await transactionManager
        .getRepository(StaticRelation)
        .find({
          join: {
            alias: 'staticTablesRelation',
            leftJoinAndSelect: {
              site: 'staticTablesRelation.site',
              section: 'staticTablesRelation.section',
              item: 'staticTablesRelation.item',
            },
          },
          where: {
            site,
            isDeleted: false,
          },
        });

      let sections = [];
      for (let e of siteRelations) {
        if (!isNullOrUndefined(e.section)) {
          const section = await transactionManager
            .getRepository(StaticSection)
            .findOne({ id: e.section.id, isDeleted: false });
          if (section) {
            const relationItems = await this.getStaticObject(
              transactionManager,
              { section: e.section },
            );
            if (relationItems) {
              section['items'] = [];
              for (let i of relationItems) {
                if (!isNullOrUndefined(i.item)) {
                  const item = await transactionManager
                    .getRepository(StaticItem)
                    .findOne({ id: i.item.id, isDeleted: false });
                  section['items'].push(item);
                }
              }
            }
            sections.push(section);
          }
        }
        if (!isNullOrUndefined(e.item)) {
          const item = await transactionManager
            .getRepository(StaticItem)
            .findOne({ id: e.item.id, isDeleted: false });
          staticPage.item = item;
        }
      }

      staticPage.sections = sections;
      return { code: 201, data: { staticPage } };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 
   * @param transactionManager 
   * @param object 
   * @returns 
   */
  private async getStaticObject(transactionManager: EntityManager, object) {
    const where = { isDeleted: false, ...object };

    return await transactionManager.getRepository(StaticRelation).find({
      join: {
        alias: 'staticTablesRelation',
        leftJoinAndSelect: {
          site: 'staticTablesRelation.site',
          section: 'staticTablesRelation.section',
          item: 'staticTablesRelation.item',
        },
      },
      where,
    });
  }
}

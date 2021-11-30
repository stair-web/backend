import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  isNullOrUndefined,
  isUuid,
  uuidv4,
} from 'src/common/utils/common.util';
import { EntityManager } from 'typeorm';
import { StaticItem } from '../static-item/static-item.entity';
import { StaticItemRepository } from '../static-item/static-item.repository';
import { StaticRelation } from '../static-relation/static-relation.entity';
import { StaticRelationRepository } from '../static-relation/static-relation.repository';
import { StaticSection } from '../static-section/static-section.entity';
import { StaticSectionRepository } from '../static-section/static-section.repository';
import { SiteType } from '../static-site/enum/site-type.enum';
import { StaticSite } from '../static-site/static-site.entity';
import { StaticSiteRepository } from '../static-site/static-site.repository';
import { StaticPageResponseDto } from './dto/static-page-response.dto';
import { StaticPageDto } from './dto/static-page.dto';

@Injectable()
export class StaticPageService {
  constructor(
    private siteRepository: StaticSiteRepository,
    private sectionRepository: StaticSectionRepository,
    private itemRepository: StaticItemRepository,
    private relationRepository: StaticRelationRepository,
  ) {}
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

      if (!site) {
        return { code: 201, data: null };
      }

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
          order: { item: 'ASC' },
        });

      let sections = [];
      const siteRelationsSorted = siteRelations.sort(
        (a, b) => Number(a.id) - Number(b.id),
      );
      for (let e of siteRelationsSorted) {
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
              const relationItemsSorted = relationItems.sort(
                (a, b) => Number(a.id) - Number(b.id),
              );
              for (let i of relationItemsSorted) {
                if (!isNullOrUndefined(i.item)) {
                  const item = await transactionManager
                    .getRepository(StaticItem)
                    .findOne({ id: i.item.id, isDeleted: false });
                  if (item) {
                    section['items'].push(item);
                  }
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

  async getPageBySiteType(
    transactionManager: EntityManager,
    siteType: SiteType,
  ) {
    try {
      const site = await transactionManager
        .getRepository(StaticSite)
        .findOne({ type: siteType });

      if (!site) {
        return { code: 201, data: null };
      }

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
          order: { item: 'ASC' },
        });

      let sections = [];
      const siteRelationsSorted = siteRelations.sort(
        (a, b) => Number(a.id) - Number(b.id),
      );
      for (let e of siteRelationsSorted) {
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
              const relationItemsSorted = relationItems.sort(
                (a, b) => Number(a.id) - Number(b.id),
              );
              for (let i of relationItemsSorted) {
                if (!isNullOrUndefined(i.item)) {
                  const item = await transactionManager
                    .getRepository(StaticItem)
                    .findOne({ id: i.item.id, isDeleted: false });
                  if (item) {
                    section['items'].push(item);
                  }
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
      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param transactionManager
   * @param updateStaticPageDto
   * @returns
   */
  async updateStaticPage(
    transactionManager: EntityManager,
    updateStaticPageDto: StaticPageDto,
  ) {
    if (!isUuid(updateStaticPageDto.uuid)) {
      throw new InternalServerErrorException(
        'Site Uuid này không hợp lệ. Vui lòng kiểm tra và thử lại sau!',
      );
    }

    const site = await transactionManager
      .getRepository(StaticSite)
      .findOne({ uuid: updateStaticPageDto.uuid });

    const updateSiteBasicInfo = transactionManager.create(StaticSite, {
      id: site.id,
      title: updateStaticPageDto.title,
    });

    try {
      await transactionManager.save(updateSiteBasicInfo);
      const { item } = updateStaticPageDto;

      let isCreate = false;
      if (!isNullOrUndefined(item)) {
        if (isNullOrUndefined(item.id)) {
          item.uuid = uuidv4();
          isCreate = true;
        } else {
          item.uuid = (
            await this.itemRepository.getItemById(transactionManager, item.id)
          ).uuid;
        }

        const updateItemInfo = await this.itemRepository.saveStaticItem(
          transactionManager,
          item,
          true,
        ); // dont use isCreate in this save

        const checkExitsRelation = !isNullOrUndefined(
          this.relationRepository.checkRelationExists(
            transactionManager,
            site,
            null,
            updateItemInfo,
            false,
          ),
        );

        if (isCreate || !checkExitsRelation) {
          this.relationRepository.addSiteItem(
            transactionManager,
            site,
            updateItemInfo,
          );
        }
      }

      const { sections } = updateStaticPageDto;
      if (!isNullOrUndefined(sections) && sections.length > 0) {
        for (let section of sections) {
          let isCreate = false;
          if (isNullOrUndefined(section.id)) {
            section.uuid = uuidv4();
            isCreate = true;
          } else {
            section.uuid = (
              await this.sectionRepository.getSectionById(
                transactionManager,
                section.id,
              )
            ).uuid;
          }

          const updateSectionInfo =
            await this.sectionRepository.saveStaticSection(
              transactionManager,
              section,
              true,
            ); // dont use isCreate in this save

          const checkExitsRelation = !isNullOrUndefined(
            this.relationRepository.checkRelationExists(
              transactionManager,
              site,
              updateSectionInfo,
              null,
              false,
            ),
          );

          if (isCreate || !checkExitsRelation) {
            this.relationRepository.addSiteSection(
              transactionManager,
              site,
              updateSectionInfo,
            );
          }

          const { items } = section;

          for (let item of items) {
            let isCreate = false;

            if (!isNullOrUndefined(item)) {
              if (isNullOrUndefined(item.id)) {
                item.uuid = uuidv4();
                isCreate = true;
              } else {
                item.uuid = (
                  await this.itemRepository.getItemById(
                    transactionManager,
                    item.id,
                  )
                ).uuid;
              }

              const updateItemInfo = await this.itemRepository.saveStaticItem(
                transactionManager,
                item,
                true,
              ); // dont use isCreate in this save

              const checkExitsRelation = !isNullOrUndefined(
                this.relationRepository.checkRelationExists(
                  transactionManager,
                  updateSectionInfo,
                  null,
                  updateItemInfo,
                  false,
                ),
              );

              if (isCreate || !checkExitsRelation) {
                this.relationRepository.addSectionItem(
                  transactionManager,
                  updateSectionInfo,
                  updateItemInfo,
                );
              }
            }
          }
        }
      }
      return { code: 201, message: 'Cập nhật trang thành công!' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

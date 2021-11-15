import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBSchema } from 'src/common/enum/db-schemas.enum';
import { StaticSite } from 'src/static-site/static-site.entity';
import { StaticSection } from 'src/static-section/static-section.entity';
import { StaticItem } from 'src/static-item/static-item.entity';
@Entity({ name: 'static_site', schema: DBSchema.SCM_ARI_PUBLIC })
export class StaticRelation extends BaseEntity {
    constructor(partial: Partial<StaticRelation>) {
        super();
        Object.assign(this, partial);
      }
      @PrimaryGeneratedColumn()
      id: number;


      @ManyToOne(() => StaticSite)
      staticSiteList: StaticSite[];

      @ManyToOne(() => StaticSection)
      staticSectionList!: StaticSection[];

      @ManyToOne(() => StaticItem,)
      staticItemList: StaticItem[];
}

import { DBSchema } from 'src/common/enum/db-schemas.enum';
import { StaticItem } from 'src/static-page/static-item/static-item.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StaticSection } from '../static-section/static-section.entity';
import { StaticSite } from '../static-site/static-site.entity';

@Entity({ name: 'static_tables_relation', schema: DBSchema.SCM_ARI_PUBLIC })
export class StaticRelation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // siteId: number;

  // @Column()
  // sectionId: number;

  // @Column()
  // itemId: number;

  @Column()
  uuid: string;

  @ManyToOne((type) => StaticSite, (site) => site.id)
  @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
  site: StaticSite;

  @ManyToOne((type) => StaticSection, (section) => section.id)
  @JoinColumn({ name: 'section_id', referencedColumnName: 'id' })
  section: StaticSection;

  @ManyToOne((type) => StaticItem, (item) => item.id)
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: StaticItem;

  @Column()
  isDeleted: boolean;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

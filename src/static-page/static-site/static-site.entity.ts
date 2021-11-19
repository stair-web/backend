import { StaticSection } from './../static-section/static-section.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBSchema } from 'src/common/enum/db-schemas.enum';

@Entity({ name: 'static_site', schema: DBSchema.SCM_ARI_PUBLIC })
export class StaticSite extends BaseEntity {
  constructor(partial: Partial<StaticSite>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  title: string;

  @Column()
  isDeleted: boolean;

  // @ManyToMany(() => StaticSection,staticSection=>staticSection.staticSiteList)
  // @JoinTable({
  //   name: 'static_tables_relation',
  //   joinColumn: { name: 'site_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'section_id', referencedColumnName: 'id' },
  // })
  // public staticSectionList: StaticSection[];

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

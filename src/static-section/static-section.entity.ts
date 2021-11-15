import { DBSchema } from 'src/common/enum/db-schemas.enum';
import { StaticItem } from 'src/static-item/static-item.entity';
import { StaticRelation } from 'src/static-relation/entities/static-relation.entity';
import { StaticSite } from 'src/static-site/static-site.entity';
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

@Entity({ name: 'static_section', schema: DBSchema.SCM_ARI_PUBLIC })
export class StaticSection extends BaseEntity {
  constructor(partial: Partial<StaticSection>) {
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
  
  @OneToMany(
    () => StaticRelation,
    (staticRelation) => staticRelation.staticSectionList,
  )
  @JoinTable({
    name: 'static_tables_relation',
    joinColumn: { name: 'section_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id', referencedColumnName: 'id' },
  })
  public staticRelationList: StaticRelation[];


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

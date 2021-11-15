import { DBSchema } from 'src/common/enum/db-schemas.enum';
import { StaticRelation } from 'src/static-relation/entities/static-relation.entity';
import { StaticSection } from 'src/static-section/static-section.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'static_item', schema: DBSchema.SCM_ARI_PUBLIC })
export class StaticItem extends BaseEntity {
  constructor(partial: Partial<StaticItem>) {
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
  url: string;

  @Column()
  description: string;

  @Column()
  isDeleted: boolean;

  @OneToMany(
    () => StaticRelation,
    (staticRelation) => staticRelation.staticItemList,
  )
  @JoinTable({
    name: 'static_tables_relation',
    joinColumn: { name: 'item_id', referencedColumnName: 'id' },
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

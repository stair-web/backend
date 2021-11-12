import { StaticSection } from "src/static-section/static-section.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'static_item', schema: 'public' })
export class StaticItem  extends BaseEntity {
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

      @ManyToMany(() => StaticSection,staticSection=>staticSection.staticItemList)
      @JoinTable({
        name: 'static_tables_relation',
        joinColumn: { name: 'item_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'section_id', referencedColumnName: 'id' },
      })
      staticSectionList: StaticSection[];

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

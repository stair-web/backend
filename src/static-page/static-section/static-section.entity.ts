import { StaticItem } from "src/static-page/static-item/static-item.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { StaticSite } from "../static-site/static-site.entity";


@Entity({ name: 'static_section', schema: 'public' })

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

      @ManyToMany(() => StaticSite,staticSite=>staticSite.staticSectionList)
      @JoinTable({
        name: 'static_tables_relation',
        joinColumn: { name: 'section_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'site_id', referencedColumnName: 'id' },
      })
      staticSiteList: StaticSite[];

      @ManyToMany(() => StaticItem,staticItem=>staticItem.staticSectionList)
      @JoinTable({
        name: 'static_tables_relation', 
        joinColumn: { name: 'section_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'item_id', referencedColumnName: 'id' },
      })
      staticItemList: StaticItem[];

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

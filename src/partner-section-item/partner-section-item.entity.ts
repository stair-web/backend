import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBSchema } from 'src/common/enum/db-schemas.enum';
import { Partner } from 'src/partner/partner.entity';

@Entity({ name: 'partner_section_item', schema: DBSchema.SCM_ARI_PUBLIC })
export class PartnerSectionItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    uuid: string;
  
    @Column()
    title: string;
  
    @Column()
    imgUrl: string;

    @Column()
    language: string;

    @ManyToOne(
      () => Partner,
      (partner: Partner) => partner.id,
      {
        eager: false,
      },
    )
    @JoinColumn({ name: 'partner_id' })
    partner: Partner;
  
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
  
    @Column()
    isDeleted: boolean = false;
}

import { PartnerSectionItem } from './../partner-section-item/partner-section-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBSchema } from 'src/common/enum/db-schemas.enum';

@Entity({ name: 'partner',  schema: DBSchema.SCM_ARI_PUBLIC})
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  urlLogo: string;

  @Column()
  introDescription: string;

  @Column()
  introTitle: string;

  @Column()
  partershipDescription: string;

  @Column()
  partershipTitle: string;

  @Column()
  partershipImgUrl: string;

  @Column()
  sectionItemTitle: string;

  @OneToMany(
    () => PartnerSectionItem,
    (partnerSectionItem: PartnerSectionItem) => partnerSectionItem.partner,
    {
      eager: false,
    },
  )
  partnerSectionItemList: PartnerSectionItem[];

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

  @Column({
      default:false
  })
  isDeleted: boolean;
}

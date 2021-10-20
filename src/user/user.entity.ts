import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: "user", schema: "public" })
export class User extends BaseEntity {
    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    first_name: string;

    @ApiProperty()
    @Column()
    last_name: string;

    @ApiProperty()
    @Column({ length: 50 })
    phone_number: string;

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column()
    is_deleted: boolean; 

    @ApiProperty()
    @Column()
    is_actived: boolean;

    @ApiHideProperty()
    @Column()
    @Exclude()
    password: string; 

    @Column()
    @Exclude()
    personal_email: string; 

    @Column()
    @Exclude()
    position: string; 

    @ApiHideProperty()
    @Column()
    @Exclude()
    salt: string;

    @ApiProperty()
    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty()
    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ApiProperty()
    @Column()
    dob: Date;

    @ApiProperty()
    @Column()
    uuid: string;

    @ApiProperty()
    @Column()
    profile_photo_key: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
        
    }

    async validateEmail(email: string): Promise<boolean> {
        return email === this.email;
    }
}

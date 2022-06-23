import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('room')
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomCode: string;

    @Column()
    roomName: string;

    @Column()
    isDeleted: boolean;

    @Column()
    createdAt: Date;
}
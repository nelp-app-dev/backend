import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'datetime', default: () => new Date()})
  createdAt: Date;

  @Column({type: 'datetime', default: () => new Date()})
  updatedAt: Date;
}

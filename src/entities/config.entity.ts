import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'varchar', length: 50 })
  key: string;

  @Column({ type: 'varchar', length: 500 })
  value: string;

  @CreateDateColumn({ name: 'reg_dt' })
  regDt: Date;

  @UpdateDateColumn({ name: 'upd_dt' })
  updDt: Date;
}

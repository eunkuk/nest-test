import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 10 })
  roles: string;

  @CreateDateColumn({ type: 'timestamp' })
  reg_dt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  upd_dt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('exam')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', default: 'F' })
  is_delete: string;

  @CreateDateColumn({ type: 'timestamp' })
  reg_dt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  upd_dt: Date;
}

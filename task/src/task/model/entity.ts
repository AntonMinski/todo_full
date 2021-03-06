
import { User } from 'src/user/model/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.tasks)
    user: User;
}



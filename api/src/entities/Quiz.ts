import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ObjectIdColumn,
} from "typeorm";
import { ObjectId } from "mongodb";
import { User } from "./User";

@Entity("quizzes")
export class Quiz extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  title!: string;

  @ManyToOne(() => User, { nullable: true })
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}

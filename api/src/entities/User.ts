import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

export type UserRole = "admin" | "contributor" | "user";

@Entity("users")
export class User extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column({ unique: true })
  email!: string;

  @Column()
  hashedPassword!: string;

  @Column()
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}

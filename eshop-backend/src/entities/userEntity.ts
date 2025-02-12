import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "eshop", name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column()
  status!: string;

  @Column()
  role!: string;

  @Column({ nullable: true })
  token!: string;
}

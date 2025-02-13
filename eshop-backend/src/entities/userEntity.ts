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

  @Column({ type: "text", nullable: true })
  token!: string | null;

  @Column({ type: "text", nullable: true })
  refreshToken!: string | null;

  @Column({ type: "text", nullable: true })
  refreshTokenExpiry!: Date | null;
}

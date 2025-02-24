import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("logs")
export class LogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 10 })
  level!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "text", nullable: true })
  stackTrace!: string;

  @CreateDateColumn({ type: "timestamp" })
  timestamp!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "eshop", name: "item" })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  category!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;
}

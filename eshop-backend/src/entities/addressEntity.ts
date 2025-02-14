import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ schema: "eshop", name: "address" })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  street!: string;

  @Column()
  zip!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderDetailEntity } from "./orderDetailEntity";

@Entity({ schema: "eshop", name: "order" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  userId!: number;

  @Column({ nullable: false })
  orderDate!: Date;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order, {
    nullable: false,
    cascade: true,
  })
  orderDetails!: OrderDetailEntity[];

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  totalPrice!: number;

  @Column({ nullable: false })
  deliveryAddressId!: number;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  lastName!: string;

  @Column({ nullable: false })
  street!: string;

  @Column({ nullable: false })
  zip!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  country!: string;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { OrderEntity } from "./orderEntity";

@Entity({ schema: "eshop", name: "order_detail" })
export class OrderDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  itemId: number;

  @Column({ nullable: false })
  itemName: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  itemUnitPrice: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  totalPrice: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails, {
    nullable: false,
  })
  @JoinColumn({ name: "orderId" })
  order?: OrderEntity;

  constructor(
    itemId: number,
    itemName: string,
    itemUnitPrice: number,
    quantity: number,
    totalPrice: number,
    order?: OrderEntity
  ) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.itemUnitPrice = itemUnitPrice;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.order = order;
  }
}

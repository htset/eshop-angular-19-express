import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Order } from "../../../shared/order";
import { OrderEntity } from "../entities/orderEntity";
import { createOrder, createOrderEntity } from "../helpers/mappings";

export class OrderController {
  static async saveOrder(req: Request, res: Response) {
    try {
      const order: Order = req.body;

      //Validate request body
      if (!order.userId || typeof order.userId !== "number") {
        res.status(400).json({ message: "Invalid or missing userId" });
        return;
      }
      if (
        !Array.isArray(order.orderDetails) ||
        order.orderDetails.length === 0
      ) {
        res
          .status(400)
          .json({ message: "Order details must be a non-empty array" });
        return;
      }

      const orderRepository = AppDataSource.getRepository(OrderEntity);
      const orderEntity = await createOrderEntity(order);

      const savedOrder = await orderRepository.save(orderEntity);
      res.status(201).json(createOrder(savedOrder));
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

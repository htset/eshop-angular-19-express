import { Order } from "../../../shared/order";
import { OrderDetail } from "../../../shared/orderDetail";
import { User } from "../../../shared/user";
import { AppDataSource } from "../config/data-source";
import { AddressEntity } from "../entities/addressEntity";
import { ItemEntity } from "../entities/itemEntity";
import { OrderDetailEntity } from "../entities/orderDetailEntity";
import { OrderEntity } from "../entities/orderEntity";
import { UserEntity } from "../entities/userEntity";

//Create a Data Transfer Object (DTO) from the User Entity
export function createDTO(user: UserEntity): User {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    token: user.token,
    refreshToken: user.refreshToken,
    refreshTokenExpiry: user.refreshTokenExpiry,
  };
}

//Create an Order Entity from a Data Transfer Object (DTO)
export async function createOrderEntity(dto: Order) {
  try {
    const addressRepository = AppDataSource.getRepository(AddressEntity);
    const itemRepository = AppDataSource.getRepository(ItemEntity);

    const newOrder = new OrderEntity();
    newOrder.userId = dto.userId || 0;
    newOrder.orderDate = new Date();

    //Fetch the delivery address
    const tempAddr = await addressRepository.findOneBy({
      userId: dto.userId,
    });
    if (!tempAddr) {
      throw new Error("Address not found");
    }

    newOrder.deliveryAddressId = tempAddr.id;
    newOrder.firstName = tempAddr.firstName;
    newOrder.lastName = tempAddr.lastName;
    newOrder.street = tempAddr.street;
    newOrder.zip = tempAddr.zip;
    newOrder.city = tempAddr.city;
    newOrder.country = tempAddr.country;

    newOrder.orderDetails = [];

    let totalPrice = 0;

    //Loop through order details
    if (dto.orderDetails !== undefined) {
      for (const detail of dto.orderDetails) {
        if (!detail.itemId || typeof detail.itemId !== "number") {
          throw {
            status: 400,
            message: "Invalid or missing itemId in order details",
          };
        }
        if (
          !detail.quantity ||
          typeof detail.quantity !== "number" ||
          detail.quantity <= 0
        ) {
          throw { status: 400, message: "Quantity must be a positive number" };
        }

        const tempItem = await itemRepository.findOneBy({
          id: detail.itemId,
        });
        if (!tempItem) {
          throw new Error("Item not found");
        }

        const newOrderDetail = new OrderDetailEntity(
          detail.itemId || 0,
          tempItem.name,
          tempItem.price,
          detail.quantity || 0,
          tempItem.price * (detail.quantity || 0)
        );

        newOrder.orderDetails.push(newOrderDetail);
        totalPrice += newOrderDetail.totalPrice;
      }
    }
    newOrder.totalPrice = totalPrice;

    return newOrder;
  } catch (error) {
    throw new Error("Internal server error");
  }
}

//Create a Data Transfer Object (DTO) from the Order Entity
export function createOrder(entity: OrderEntity) {
  try {
    const newOrder = new Order();
    newOrder.userId = entity.userId;
    newOrder.orderDate = entity.orderDate;
    newOrder.deliveryAddressId = entity.deliveryAddressId;
    newOrder.firstName = entity.firstName;
    newOrder.lastName = entity.lastName;
    newOrder.street = entity.street;
    newOrder.zip = entity.zip;
    newOrder.city = entity.city;
    newOrder.country = entity.country;
    newOrder.totalPrice = entity.totalPrice;

    newOrder.orderDetails = [];

    for (const detail of entity.orderDetails) {
      const newOrderDetail = new OrderDetail();
      newOrderDetail.id = detail.id;
      newOrderDetail.itemId = detail.itemId;
      newOrderDetail.itemName = detail.itemName;
      newOrderDetail.itemUnitPrice = detail.itemUnitPrice;
      newOrderDetail.quantity = detail.quantity;
      newOrderDetail.totalPrice = detail.totalPrice;
      newOrderDetail.orderId = detail.order?.id;

      newOrder.orderDetails.push(newOrderDetail);
    }

    return newOrder;
  } catch (error) {
    throw new Error("Internal server error");
  }
}

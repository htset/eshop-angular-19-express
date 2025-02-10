import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ItemPayload } from "../../../shared/itemPayload";
import { Item } from "../../../shared/item";
import { ItemEntity } from "../entities/itemEntity";

export class ItemController {
  //Get all items
  static async getAllItems(req: Request, res: Response) {
    try {
      const itemRepository = AppDataSource.getRepository(ItemEntity);
      const [items, totalItems] = await itemRepository.findAndCount();

      //Return response
      const payload: ItemPayload = {
        items: items.map((item) => ItemController.mapItemEntityToItem(item)),
        count: totalItems,
      };

      res.json(payload);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred." });
      }
    }
  }

  //Get item by ID
  static async getItemById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const itemRepository = AppDataSource.getRepository(ItemEntity);
      const item = await itemRepository.findOne({
        where: { id: parseInt(id, 10) },
      });

      if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
      }
      res.json(item);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred." });
      }
    }
  }

  static mapItemEntityToItem(itemEntity: ItemEntity): Item {
    return {
      id: itemEntity.id,
      name: itemEntity.name,
      price: itemEntity.price,
      category: itemEntity.category,
      description: itemEntity.description,
    };
  }
}

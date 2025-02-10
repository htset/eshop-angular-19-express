import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { ItemPayload } from "../../../shared/itemPayload";
import { Item } from "../../../shared/item";
import { In, Like } from "typeorm";
import { ItemEntity } from "../entities/itemEntity";

export class ItemController {
  //Get all items
  static async getAllItems(req: Request, res: Response) {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (pageNumber - 1) * pageSize;
    const name = req.query.name as string;
    const category = req.query.category as string;

    try {
      //Build the query conditions
      const whereConditions: any = {};
      if (name) {
        whereConditions.name = Like(`%${name}%`); //Filter by name
      }
      if (category) {
        //Split the category string into an array and use it for filtering
        //Use TypeORM's In() to search for multiple categories
        whereConditions.category = In(category.split(","));
      }

      console.log("Where Conditions:", whereConditions);

      const itemRepository = AppDataSource.getRepository(ItemEntity);
      const [items, totalItems] = await itemRepository.findAndCount({
        where: whereConditions,
        skip: offset,
        take: pageSize,
      });

      //Return paginated response
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

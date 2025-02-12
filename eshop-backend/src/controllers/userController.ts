import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { UserEntity } from "../entities/userEntity";
import { User } from "../../../shared/user";
import { createDTO } from "../helpers/mappings";

export class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      //Fetch users from the database
      const users = await AppDataSource.manager.find(UserEntity);

      //Convert entities to DTOs
      const userDTOs: User[] = users.map(createDTO);

      res.json(users);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred." });
      }
    }
  }
}

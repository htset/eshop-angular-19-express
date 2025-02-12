import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { UserEntity } from "../entities/userEntity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createDTO } from "../helpers/mappings";

const JWT_SECRET = "our_jwt_secret";

export class AuthController {
  //Login method
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ username });

      if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      //Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      //Create a JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        {
          expiresIn: "1h", //Token expires in 1 hour
        }
      );

      //Update the user with token
      user.token = token;

      //Save the updated user to the database
      await userRepository.save(user);

      //Clear sensitive data
      user.password = "";

      //Create and return a DTO (Data Transfer Object) of the user
      res.json(createDTO(user));
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred." });
      }
    }
  }
}

import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { UserEntity } from "../entities/userEntity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createDTO } from "../helpers/mappings";

const JWT_SECRET = "our_jwt_secret";
const REFRESH_TOKEN_SECRET = "our_refresh_token_secret";

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
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        {
          expiresIn: "2m", //Token expires in 2 minutes
        }
      );

      //Create a refresh token with a 30-day expiry
      const refreshToken = jwt.sign(
        { id: user.id, username: user.username },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "30d", // Refresh token expiration time
        }
      );

      //Update the user with tokens and expiry
      user.token = token;
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    try {
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
      }

      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ refreshToken });

      if (!user) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      //Verify refresh token
      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
          if (err) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
          }

          //Issue a new access token
          const newToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "2m" }
          );

          //Update user with new token
          user.token = newToken;
          await userRepository.save(user);

          //return updated user to frontend
          res.json(createDTO(user));
        }
      );
    } catch (err) {
      res.status(500).json({
        message:
          err instanceof Error ? err.message : "An unknown error occurred.",
      });
    }
  }

  static async revokeToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    try {
      if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
      }

      const userRepository = AppDataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ refreshToken });

      if (!user) {
        res.status(400).json({ message: "Invalid refresh token" });
        return;
      }

      //Remove the tokens from the user entity
      user.token = null;
      user.refreshToken = null;
      user.refreshTokenExpiry = null;

      await userRepository.save(user);

      res.json({ message: "Refresh token revoked successfully" });
    } catch (err) {
      res.status(500).json({
        message:
          err instanceof Error ? err.message : "An unknown error occurred.",
      });
    }
  }
}

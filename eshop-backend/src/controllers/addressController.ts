import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AddressEntity } from "../entities/addressEntity";
import { Address } from "../../../shared/address";

export class AddressController {
  // Get address by user ID
  static async getAddressByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const addressRepository = AppDataSource.getRepository(AddressEntity);
      const address = await addressRepository.find({
        where: { userId: parseInt(userId, 10) },
      });

      res.json(address);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred." });
      }
    }
  }

  static async saveAddress(req: Request, res: Response) {
    try {
      const address: Address = req.body;

      const addressRepository = AppDataSource.getRepository(AddressEntity);

      if (address.id && address.id > 0) {
        // Update existing address
        const savedAddress = await addressRepository.save(address);
        res.status(200).json(savedAddress);
      } else {
        // Create new address
        address.id = undefined;
        const savedAddress = await addressRepository.save(address);
        res.status(201).json(savedAddress);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Address not found") {
        res.status(404).json({ message: "Address not found" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const addressRepository = AppDataSource.getRepository(AddressEntity);
      await addressRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Address not found") {
        res.status(404).json({ message: "Address not found" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

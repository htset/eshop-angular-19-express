import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { LogEntity } from "../entities/logEntity";

export class LoggingController {
  static async postLog(req: Request, res: Response) {
    const { level, message, stackTrace } = req.body;

    try {
      //Save log entry using TypeORM
      const logRepository = AppDataSource.getRepository(LogEntity);
      const logEntry = logRepository.create({
        level,
        message,
        stackTrace: stackTrace || null,
      });

      await logRepository.save(logEntry);

      //Log to console as well
      console.log({
        level,
        message,
        stackTrace: stackTrace || null,
      });

      res.status(200);
    } catch (error) {
      console.error("Error saving log to database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

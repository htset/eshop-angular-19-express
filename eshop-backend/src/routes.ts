import { Router } from "express";
import { ItemController } from "./controllers/itemController";

const router = Router();

router.get("/items", ItemController.getAllItems);
router.get("/items/:id", ItemController.getItemById);
router.get("/", ItemController.getAllItems);

export default router;

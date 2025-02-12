import { Router } from "express";
import { ItemController } from "./controllers/itemController";
import { AuthController } from "./controllers/authController";

const router = Router();

router.post("/auth/login", AuthController.login);
router.get("/items", ItemController.getAllItems);
router.get("/items/:id", ItemController.getItemById);
router.get("/", ItemController.getAllItems);

export default router;

import { Router } from "express";
import { ItemController } from "./controllers/itemController";
import { AuthController } from "./controllers/authController";
import { authenticateToken } from "./middleware/authentication";
import { authorizeAdmin } from "./middleware/authorization";
import { UserController } from "./controllers/userController";

const router = Router();

router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  UserController.getUsers
);

router.post("/auth/login", AuthController.login);
router.get("/items", ItemController.getAllItems);
router.get("/items/:id", ItemController.getItemById);
router.get("/", ItemController.getAllItems);

export default router;

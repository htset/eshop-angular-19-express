import { Router } from "express";
import { ItemController } from "./controllers/itemController";
import { AuthController } from "./controllers/authController";
import { authenticateToken } from "./middleware/authentication";
import { authorizeAdmin } from "./middleware/authorization";
import { UserController } from "./controllers/userController";
import { AddressController } from "./controllers/addressController";

const router = Router();

// Protected routes (require authentication)
router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  UserController.getUsers
);

router.get(
  "/addresses/:userId",
  authenticateToken,
  AddressController.getAddressByUserId
);

router.post("/addresses", authenticateToken, AddressController.saveAddress);

router.delete(
  "/addresses/:id",
  authenticateToken,
  AddressController.deleteAddress
);

//Non-protected routes
router.post("/auth/login", AuthController.login);
router.post("/auth/refresh", AuthController.refreshToken);
router.post("/auth/revoke", AuthController.revokeToken);
router.get("/items", ItemController.getAllItems);
router.get("/items/:id", ItemController.getItemById);
router.get("/", ItemController.getAllItems);

export default router;

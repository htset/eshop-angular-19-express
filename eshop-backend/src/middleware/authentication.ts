import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//Secret key for verifying the JWT token
const JWT_SECRET = "our_jwt_secret";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  //Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; //Format: "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  //Verify the token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    //Attach the user information to the request
    (req as any).user = user;

    next(); //Proceed to the next middleware/route handler
  });
}

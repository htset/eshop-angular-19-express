import { Request, Response, NextFunction } from "express";

//Middleware to check if the user has an admin role
export function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  //Assuming user is attached by the authenticateToken middleware
  const user = (req as any).user;

  if (user && user.role === "ADMIN") {
    //User is admin, proceed to the next middleware or route handler
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
}

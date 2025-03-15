import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;
  const token = authToken && authToken.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (process.env.JWT_SECRET === undefined) {
    throw new Error("JWT_SECRET TOKEN is missing");
  }
  // console.log("Token", token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
    algorithms: ["RS256"],
  });
  // console.log("Decoded", decoded);
  if (!decoded) {
    res.status(401).json({ message: "Unauthorized User" });
    return;
  }

  const userId = (decoded as any).sub;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized User" });
    return;
  }
  req.userId = userId;
  next();
}

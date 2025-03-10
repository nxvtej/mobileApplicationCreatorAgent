import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
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
  const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
    algorithms: ["RS256"],
  });
  if (!decoded) {
    res.status(401).json({ message: "Unauthorized User" });
    return;
  }

  const userId = (decoded as any).userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized User" });

    return;
  }
  req.userId = userId;
  next();
}

import { prismaClient } from "db/client";
import { redisClient } from "@docker/redis/client";
import express from "express";
import cors from "cors";
/**
 * Tech wavy of handling CORS
 */
function cors_(): any {
  return (req: any, res: any, next: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  };
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.listen(prompt, () => {
  console.log(`Server is running on port ${PORT}`);
});

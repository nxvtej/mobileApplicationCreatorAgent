import { prismaClient } from "db/client";
import { redisClient } from "@docker/redis/client";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";
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

app.post("/project", authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId;
  // add logic to get the usefull name from the prompt
  const name = prompt.split(" ")[0];
  const descriptions = prompt.split("\n")[0];
  const project = await prismaClient.project.create({
    data: {
      name,
      descriptions,
      userId,
    },
  });
  res.json({ project, projectId: project.id });
});

app.get("/project", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const project = await prismaClient.project.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.json(project);
});

app.listen(prompt, () => {
  console.log(`Server is running on port ${PORT}`);
});

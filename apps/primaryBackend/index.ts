import { prismaClient } from "db/client";
import { redisClient } from "@docker/redis/client";
import express from "express";
import cors from "cors";
import authMiddleware from "./middleware";

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If using cookies or auth tokens
  })
);

app.use(express.json());

app.post("/project", authMiddleware, async (req, res) => {
  console.log("Creating a new project");
  const { prompt } = req.body;
  const userId = req.userId || "";
  // add logic to get the usefull name from the prompt
  const name = prompt.split(" ")[0];
  const descriptions = prompt.split("\n")[0];
  const project = await prismaClient.project.create({
    data: {
      name,
      description: descriptions,
      userId,
    },
  });
  res.json({ project, projectId: project.id });
});

app.get("/projects", authMiddleware, async (req, res) => {
  console.log("Getting all projects");
  console.log(req.userId, "userId", "paramas are ", req.params);
  const { id } = req.params;
  const project = await prismaClient.project.findMany({
    where: {
      userId: "user_2uLKQyU5KkkOXyTttP89XQw7c9Q",
    },
  });
  console.log("Project", project);
  res.json({ projects: project });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

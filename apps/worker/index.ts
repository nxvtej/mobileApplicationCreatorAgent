import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { prismaClient } from "db/client";
import { systemPrompt } from "./systemPrompt";
import { ArtifactProcessor } from "./parse";
import { onFileUpdate, onShellCommand } from "./os";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.post("/prompt", async (req, res) => {
  const { prompt, projectId } = req.body;
  const client = new OpenAI({
    apiKey: "Navdeep_IntegrationGLS",
    baseURL: "https://llm-proxy.internal.cleartax.co/openai/v1",
  });

  await prismaClient.prompt.create({
    data: {
      content: prompt,
      projectId: projectId,
      type: "USER",
    },
  });

  const allPrompt = await prismaClient.prompt.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let artifactProcessor = new ArtifactProcessor(
    "",
    onFileUpdate,
    onShellCommand
  );
  let artifact = "";
  try {
    //   forwared request to openai
    const stream = await client.chat.completions.create({
      model: "gpt-4o",
      messages: allPrompt.map((prompt) => {
        return {
          role: prompt.type.toLowerCase() as "user" | "system",
          content: prompt.content,
        };
      }),
      //   system: systemPrompt(project.type),
      stream: true,
    });
    for await (const response of stream) {
      const text = response.choices[0]?.delta?.content || "";
      artifactProcessor.append(text);
      artifactProcessor.parse();
      artifact += text;
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(9091, () => {
  console.log(`Server is running on port 9091`);
});

import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export function Prompt() {
  const [prompt, setPrompt] = useState("");
  const { getToken } = useAuth();
  const sendHandler = async () => {
    const token = await getToken();
    const response = await axios.post(
      "/project",
      {
        prompt: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);
  };
  return (
    <div>
      <textarea
        placeholder="Create a chess appplication...."
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />

      <div>
        <Button onClick={sendHandler}>Send</Button>
      </div>
    </div>
  );
}

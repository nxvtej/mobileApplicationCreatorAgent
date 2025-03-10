"use client";
import { useState, useEffect } from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";

import { SignUpButton, SignedOut } from "@clerk/nextjs";

export default function Home() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setKey((prevKey) => prevKey + 1); // Change the key to force re-render
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col item-center justify-center min-h-screen w-full bg-black">
      <Spotlight className="fixed -top-40 left-0 md:left-60 " fill="white" />
      <Navbar />

      <div className="flex flex-col justify-center items-center flex-grow overflow-hidden">
        {/* Pass the key to trigger reinitialization */}
        <TypewriterEffectSmooth
          key={key}
          words={[
            {
              text: "Build Awesome Mobile Applications Using AI Agents",
            },
          ]}
          className="text-center text-white text-4xl font-bold"
          cursorClassName="bg-blue-500"
        />
        <div>
          <SignedOut>
            <SignUpButton>
              <Button className="cursor-pointer hover:bg-primary ">
                Register and Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
      <div></div>
    </div>
  );
}

// make this client render

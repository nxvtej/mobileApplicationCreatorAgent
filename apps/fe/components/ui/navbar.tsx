import { Button } from "./button";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="text-white">AI Agent</div>
      <div className="text-white flex cursor-pointer items-center space-x-2   text-primary-foreground shadow-xs m-2 px-2 py-2 h-9 px-2 py-2 has-[>svg]:px-3 rounded-md">
        <SignedOut>
          <SignInButton>
            <Button className="cursor-pointer hover:bg-primary ">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton>
            <Button className="cursor-pointer hover:bg-primary ">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

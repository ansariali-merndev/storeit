"use client";

import { signOutUser } from "@/lib/action/user.action";
import { Button } from "./ui/button";

export const SignOut = () => {
  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant={"destructive"}
      className="cursor-pointer"
    >
      Sign out
    </Button>
  );
};

"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { LogOut } from "lucide-react";
import { cn } from "../utils/generelUtils";

function SignOut({ title,className }: { title?: string,className?:string }) {
  const signOutAction = async () => {
    await signOut();
  };
  return (
    <button onClick={signOutAction} className={cn(className)}>
      <LogOut />
      {title}
    </button>
  );
}

export default SignOut;

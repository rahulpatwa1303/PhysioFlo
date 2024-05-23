"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { LogOut } from "lucide-react";

function SignOut() {
  const signOutAction = async () => {
    await signOut();
  };
  return (
    <button onClick={signOutAction}>
      <LogOut />
    </button>
  );
}

export default SignOut;

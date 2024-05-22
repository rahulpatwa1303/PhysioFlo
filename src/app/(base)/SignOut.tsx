"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { LogOut } from "lucide-react";

function SignOut() {
  const signOutAction = async () => {
    await signOut();
  };
  return (
    <form action={signOutAction}>
      <button>
        <LogOut />
      </button>
    </form>
  );
}

export default SignOut;

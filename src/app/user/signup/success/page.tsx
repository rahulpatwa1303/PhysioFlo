"use server";
import React from "react";
import { MailCheck } from "lucide-react";
import { redirect } from "next/navigation";

function SuccessSignPage() {
  const redirectToSignIn = () => {
    "use server";
    redirect("/user/signIn");
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex border border-teal-400 flex-col p-4 rounded-lg text-center justify-center items-center">
        <MailCheck />
        <b>Your registration request has been received.</b> An administrator
        will review it shortly.
        <br /> Upon approval, you will receive a confirmation email at the
        address you provided.
        <form action={redirectToSignIn}>
          <button className="p-2 bg-teal-400 rounded-xl hover:bg-teal-200 mt-4 text-teal-800">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default SuccessSignPage;

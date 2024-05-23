"use client";
import GoogleLogo from "@/app/assests/google";
import { signIn } from "next-auth/react";

function LogIn() {
  const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await signIn("google", {
      callbackUrl: `/home?visits_for=visit-log&date=${new Date().toLocaleDateString()}`,
    });
  };

  return (
    <div className="w-full m-auto">
      <div className="w-full flex justify-center mt-40 flex-col items-center gap-4">
        <p className="text-5xl text-teal-700">PhysioFlow</p>
        <div className="flex flex-col gap-4">
          <button
            className="py-2 px-10 flex text-xl gap-4 text-teal-700 font-extrabold border rounded-lg border-teal-400 hover:bg-teal-200/20"
            onClick={handleLogin}
          >
            <GoogleLogo height={"32px"} width={"32px"} /> Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogIn;

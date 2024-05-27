"use client";
import GoogleLogo from "@/app/assests/google";
import { signIn } from "next-auth/react";
import Image from "next/image";
import PhysioFloIcon from "@/app/assests/physio-flo-no-bg.svg";

function LogIn() {
  const handleLogin = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    await signIn("google", {
      callbackUrl: `/home?visits_for=visit-log&date=${formattedDate}`,
    });
  };

  return (
    <div className="w-full h-[100dvh] flex justify-center">
      <div className="w-full flex justify-center flex-col items-center gap-4">
        <Image src={PhysioFloIcon} alt="PhysioFlo logo" />
        <p className="text-3xl text-teal-700">Welcome to PhysioFlow</p>
        <div className="flex flex-col gap-4 text-brand-700 items-center">
          <p className="text-lg">Sign in using</p>
          <button
            className="py-2 px-10 flex items-center text-xl gap-4 text-brand-100 font-extrabold border rounded-lg  bg-brand-900 hover:brightness-200"
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

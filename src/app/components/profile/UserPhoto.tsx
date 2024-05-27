"use client";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

function UserPhoto() {
  const session = useSession();
  console.log('session',session)
  return (
    <div className="flex justify-center flex-col items-center">
      {session?.data?.user?.image ? (
        <Image
          src={session?.data?.user?.image!}
          alt="profile-img"
          width={144}
          height={144}
          className="rounded-full"
        />
      ) : (
        <div className="w-36 h-36 rounded-full bg-brand-100">
          <User className="text-brand-600" />
        </div>
      )}
      <p className="text-lg font-semibold text-brand-800">{session?.data?.user?.name}</p>
      <p className="text-sm font-light text-brand-700">{session?.data?.user?.email}</p>
    </div>
  );
}

export default UserPhoto;

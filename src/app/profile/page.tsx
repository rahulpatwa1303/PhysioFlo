import React from "react";
import UserPhoto from "../components/profile/UserPhoto";
import SignOut from "../(base)/SignOut";

function Profile() {
  return (
    <div className="px-4 pt-16 h-full pb-[60px] space-y-4 overflow-auto backdrop-blur-3xl">
      <UserPhoto />
      <hr className="border-brand-500"/>
      <div>
        <SignOut className="flex gap-6 w-full text-brand-700" title="Sign Out"/>
      </div>
    </div>
  );
}

export default Profile;

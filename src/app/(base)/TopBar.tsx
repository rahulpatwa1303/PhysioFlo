"use server";
import React from "react";
import SignOut from "./SignOut";

const NavItem = ({
  icon,
  title,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  link: string;
}) => {
  return (
    <a
      href={link}
      className="w-full flex focus:text-teal-500 hover:text-teal-500 justify-center flex-col items-center text-center pt-2 pb-1"
    >
      {icon}
      <span className="tab tab-home block text-xs">{title}</span>
    </a>
  );
};

async function TopBar() {

  return (
    <section
      id="bottom-navigation"
      className="block fixed inset-x-0 top-0 z-10 bg-brand-600 shadow "
    >
      <div id="tabs" className="flex justify-between py-3 px-4">
        <p>PhysioFlow</p>
        <SignOut/>
      </div>
    </section>
  );
}

export default TopBar;

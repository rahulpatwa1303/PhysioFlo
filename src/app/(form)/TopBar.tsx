"use server";
import { ChevronLeft } from "lucide-react";
import React from "react";
import BackButton from "../components/BackButton";

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
    <div
      id="top-bar"
      className="block fixed inset-x-0 top-0 z-10 bg-brand-600 shadow "
    >
      <div id="tabs" className="flex justify-between py-3 px-4">
        <BackButton />
        <p>PhysioFlow</p>
      </div>
    </div>
  );
}

export default TopBar;

import React from "react";
import { Home } from "lucide-react";

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

function BottomBar() {
  return (
    <section
      id="bottom-navigation"
      className="block fixed inset-x-0 bottom-0 z-10 bg-teal-600 shadow "
    >
      <div id="tabs" className="flex justify-between">
        <NavItem icon={<Home />} title={"Home"} link={"/home"} />
      </div>
    </section>
  );
}

export default BottomBar;

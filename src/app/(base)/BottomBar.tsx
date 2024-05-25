"use client";
import { Home, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

const NavItem = ({
  icon,
  title,
  link,
  isActive,
}: {
  icon: React.ReactNode;
  title: string;
  link: string;
  isActive: boolean;
}) => {
  return (
    <a
      href={link}
      className="w-full flex flex-row gap-2 text-md focus:text-teal-500 hover:text-teal-500 text-brand-100 font-semibold justify-center items-center text-center pt-2 pb-1"
      data-active-link={isActive}
    >
      {icon}
      {isActive && (
        <span className={`tab tab-home block text-md`}>{title}</span>
      )}
    </a>
  );
};

function BottomBar() {
  function ActivePathCheck(link: string) {
    const path = usePathname();
    return path === link;
  }

  const session = useSession();

  const path = [
    {
      icon: <Home />,
      title: "Home",
      link: "/home",
    },
    {
      icon: session?.data?.user?.image ? (
        <Image
          src={session?.data?.user?.image!}
          alt="profile-img"
          width={24}
          height={24}
          className="rounded-full"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-brand-100">
          <User className="text-brand-600"/>
        </div>
      ),
      title: "Profile",
      link: "/profile",
    },
  ];
  
  return (
    <div
      id="bottom-navigation"
      className="block fixed inset-x-0 bottom-0 z-10 bg-brand-600 shadow ui-open:bg-black"
    >
      <div id="tabs" className={`flex justify-between p-2 `}>
        {path.map((p, i) => {
          const isActive = ActivePathCheck(p.link);
          return (
            <div className={`p-2 ${isActive && "bg-white/20"} rounded-lg`} key={`${p.title}-${i}`}>
              <NavItem
                icon={p.icon}
                title={p.title}
                link={p.link}
                key={`${p.title}-${i}`}
                isActive={isActive}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BottomBar;

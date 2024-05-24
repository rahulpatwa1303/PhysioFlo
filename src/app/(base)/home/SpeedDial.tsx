"use client";
import { Menu, Transition } from "@headlessui/react";
import { CircleCheckBig, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

const speedDialMenu = [
  {
    id: 1,
    icon: (
      <UserPlus height={38} width={38} className="bg-teal-200 p-2 rounded-lg" />
    ),
    title: "Add patient",
    link: "/patients/onboard",
  },
  {
    id: 2,
    icon: (
      <CircleCheckBig
        height={38}
        width={38}
        className="bg-teal-200 p-2 rounded-lg"
      />
    ),
    title: "Add visit",
    link: "",
  },
];

function SpeedDial() {
  return (
    <div className="fixed end-6 bottom-20 group z-10 shadow-lg">
      <Menu as="div" className="relative ">
        <Menu.Button
          className="flex flex-col items-center space-y-2 bg-brand-700/80 p-4 rounded-lg"
          data-tooltip-target="tooltip-share"
          data-tooltip-placement="left"
        >
          <Plus
            className="ui-open:rotate-45 transition ease-in text-white font-bold w-7 h-7"
            strokeWidth={4}
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={
              "absolute bottom-20 flex flex-col gap-6 right-2 transition ease-in"
            }
          >
            {speedDialMenu.map((menu, index) => (
              <Menu.Item key={`${menu.title}-${index}`}>
                {({ active }) => (
                  <Link
                    className={
                      "flex gap-4 w-40 justify-end items-center cursor-pointer backdrop-opacity-65"
                    }
                    href={menu?.link}
                  >
                    <p className="py-2 px-2 bg-teal-100 rounded-lg">
                      {menu.title}
                    </p>
                    {menu.icon}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

export default SpeedDial;

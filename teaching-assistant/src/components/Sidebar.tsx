"use client";

import { Heading, Text } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useViewContext } from "@/contexts";
import { useState } from "react";

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { currentView, changeView } = useViewContext();

  // Updated Menus array with title, navigateTo, and src parameters
  const Menus = [
    { title: "Lessons", navigateTo: "Lessons", src: "Book" },
    { title: "Vocabulary", navigateTo: "Vocabulary", src: "Clipboard" },
    { title: "Practice", navigateTo: "Practice", src: "Pencil", gap: true },
    { title: "Progress", navigateTo: "Progress", src: "BarChart" },
    { title: "Settings", navigateTo: "Settings", src: "Settings", gap: true },
    { title: "Exit", navigateTo: "Initial", src: "X", gap: true },
  ];

  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } bg-dark-purple h-screen p-5 pt-8 relative duration-300 border-r border-gray-200 shadow-lg`}
    >
      <div
        className={`absolute cursor-pointer -right-3 top-9 w-7 bg-black border-gray-200
           border-2 rounded-full`}
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft color="white" /> : <ChevronRight color="white" />}
      </div>
      <div className="flex gap-x-4 items-center mb-6">
        <img
          src="/icons/Brain.svg"
          className={`cursor-pointer duration-500 w-10 h-10 ${open && "rotate-[360deg]"}`}
        />
        <Heading
          className={`origin-left font-medium text-xl duration-200 ${
            !open && "scale-0"
          }`}
        >
          Teacher
        </Heading>
      </div>
      <ul className="pt-6">
        {Menus.map((Menu, index) => (
          <li
            key={index}
            onClick={() => changeView(Menu.navigateTo)} // Navigate based on the navigateTo param
            className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 text-sm 
              ${Menu.gap ? "mt-9" : "mt-2"}
              ${
                currentView === Menu.navigateTo
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
          >
            <img src={`/icons/${Menu.src}.svg`} className="w-6 h-6" />
            <Text
              as="span"
              className={`${!open && "hidden"} origin-left duration-200`}
            >
              {Menu.title}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
};

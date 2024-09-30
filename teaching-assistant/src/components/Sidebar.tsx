"use client";

import { Heading, Text } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useViewContext, useAnamContext } from "@/contexts";
import { useState } from "react";
import Link from "next/link";

interface MenuItem {
  title: string;
  navigateTo: string;
  src: string;
  gap?: boolean;
  clickable: boolean;
}

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { currentView, changeView } = useViewContext();
  const { anamClient } = useAnamContext();

  const Menus: MenuItem[] = [
    { title: "Lessons", navigateTo: "Lessons", src: "Book", clickable: true },
    {
      title: "Vocabulary",
      navigateTo: "Vocabulary",
      src: "Clipboard",
      clickable: false,
    },
    {
      title: "Practice",
      navigateTo: "Practice",
      src: "Pencil",
      clickable: false,
      gap: true,
    },
    {
      title: "Progress",
      navigateTo: "Progress",
      src: "BarChart",
      clickable: false,
    },
    {
      title: "Settings",
      navigateTo: "Settings",
      src: "Settings",
      clickable: false,
      gap: true,
    },
    {
      title: "Exit",
      navigateTo: "Initial",
      src: "X",
      clickable: true,
      gap: true,
    },
  ];

  return (
    <div
      className={`${open ? "w-72" : "w-20"} bg-dark-purple h-screen p-5 pt-8 relative duration-300 border-r border-gray-200 shadow-lg`}
    >
      <div
        className="absolute cursor-pointer -right-3 top-9 w-7 bg-black border-gray-200 border-2 rounded-full"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft color="white" /> : <ChevronRight color="white" />}
      </div>
      <div
        className="flex gap-x-4 items-center mb-6"
        onClick={() => changeView("initial")}
      >
        <img
          src="/icons/Brain.svg"
          className={`cursor-pointer duration-500 w-10 h-10 ${open && "rotate-[360deg]"}`}
        />
        <Heading
          className={`origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}
        >
          Teacher
        </Heading>
      </div>
      <ul className="pt-6">
        {Menus.map(({ title, navigateTo, src, gap, clickable }) => (
          <li
            key={title}
            onClick={() => {
              if (clickable) {
                if (navigateTo === "Initial" && anamClient) {
                  anamClient.stopStreaming().catch(console.error);
                }
                changeView(navigateTo);
              }
            }}
            className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 text-sm ${gap ? "mt-9" : "mt-2"} ${
              currentView === navigateTo
                ? "bg-gray-200"
                : clickable
                  ? "hover:bg-gray-100"
                  : "opacity-50"
            } ${clickable ? "" : "pointer-events-none"}`}
          >
            <img src={`/icons/${src}.svg`} className="w-6 h-6" />
            {open && (
              <Text as="span" className="origin-left duration-200">
                {title}
              </Text>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

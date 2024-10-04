"use client";

import { Heading, Text } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useViewContext, useAnamContext } from "@/contexts";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  title: string;
  navigateTo: string;
  src: string;
  gap?: boolean;
  clickable: boolean;
}

export const NavigationSidebar = () => {
  const [open, setOpen] = useState(true);
  const { currentView, changeView } = useViewContext();
  const { anamClient } = useAnamContext();
  const router = useRouter();

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
      clickable: true,
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

  const handleExitClick = async () => {
    if (anamClient) {
      await anamClient.stopStreaming().catch(console.error);
    }
    router.push("/");
    changeView("Settings");
  };

  return (
    <div
      className={`${
        open
          ? "w-[20vw] min-w-[200px] max-w-[400px]"
          : "w-[5vw] min-w-[50px] max-w-[80px]"
      } bg-dark-purple h-screen p-5 pt-8 fixed top-0 left-0 z-50 transition-all duration-300 border-r border-gray-200 shadow-lg`}
    >
      {/* Toggle Button */}
      <div
        className="absolute cursor-pointer -right-3 top-9 w-7 bg-black border-gray-200 border-2 rounded-full"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft color="white" /> : <ChevronRight color="white" />}
      </div>
      {/* Heading and Icon */}
      <div className="flex gap-x-4 items-center mb-6">
        <img
          src="/icons/Brain.svg"
          className={`cursor-pointer duration-500 w-10 h-10 ${
            open && "rotate-[360deg]"
          }`}
        />
        {open && (
          <Heading className="origin-left font-medium text-xl duration-200">
            Teacher
          </Heading>
        )}
      </div>
      {/* Menu Items */}
      <ul className="pt-6">
        {Menus.map(({ title, navigateTo, src, gap, clickable }) => (
          <li
            key={title}
            onClick={() => {
              if (clickable) {
                if (navigateTo === "Initial") {
                  handleExitClick();
                } else {
                  changeView(navigateTo);
                }
              }
            }}
            className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 text-sm ${
              gap ? "mt-9" : "mt-2"
            } ${
              currentView === navigateTo
                ? "bg-gray-200"
                : clickable
                  ? "hover:bg-gray-100"
                  : "opacity-50"
            } ${clickable ? "" : "pointer-events-none"}`}
          >
            <img
              src={`/icons/${src}.svg`}
              className={`w-[4vw] min-w-[20px] max-w-[30px] h-auto`}
            />
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

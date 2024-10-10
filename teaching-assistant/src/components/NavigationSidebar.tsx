"use client";

import { Heading, Text } from "@radix-ui/themes";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Clipboard,
  Pencil,
  BarChart,
  Settings,
  X,
  BrainCircuit,
} from "lucide-react";
import { useViewContext, useAnamContext } from "@/contexts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { logger } from "@/utils";

interface MenuItem {
  title: string;
  navigateTo: string;
  Icon: React.ComponentType<any>;
  gap?: boolean;
  clickable: boolean;
}

export const NavigationSidebar = () => {
  const [open, setOpen] = useState(true);
  const { currentView, changeView } = useViewContext();
  const { anamClient } = useAnamContext();
  const router = useRouter();
  const { theme } = useTheme();

  const Menus: MenuItem[] = [
    { title: "Lessons", navigateTo: "Lessons", Icon: Book, clickable: true },
    {
      title: "Vocabulary",
      navigateTo: "Vocabulary",
      Icon: Clipboard,
      clickable: false,
    },
    {
      title: "Practice",
      navigateTo: "Practice",
      Icon: Pencil,
      clickable: false,
      gap: true,
    },
    {
      title: "Progress",
      navigateTo: "Progress",
      Icon: BarChart,
      clickable: false,
    },
    {
      title: "Settings",
      navigateTo: "Settings",
      Icon: Settings,
      clickable: true,
      gap: true,
    },
    {
      title: "Exit",
      navigateTo: "Initial",
      Icon: X,
      clickable: true,
      gap: true,
    },
  ];

  const handleMenuClick = async (navigateTo: string, clickable: boolean) => {
    if (!clickable) return;

    if (navigateTo === "Initial") {
      await handleExitClick();
    } else {
      if (currentView === "Lessons" && navigateTo !== "Lessons") {
        if (anamClient) {
          await anamClient.stopStreaming().catch((error) => {
            logger.error("Failed to stop streaming:", error);
          });
        }
      }
      changeView(navigateTo);
      logger.info("stopped streaming");
    }
  };

  const handleExitClick = async () => {
    if (anamClient) {
      await anamClient.stopStreaming().catch(console.error);
      logger.info("stopped streaming");
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
      } h-screen p-5 pt-8 fixed top-0 left-0 z-50 transition-all duration-300 border-r border-gray-200 dark:border-gray-500 shadow-lg`}
    >
      {/* Toggle Button */}
      <div
        className="absolute cursor-pointer -right-3 top-9 w-7 h-7 bg-black dark:bg-white border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronLeft stroke={theme === "dark" ? "black" : "white"} />
        ) : (
          <ChevronRight stroke={theme === "dark" ? "black" : "white"} />
        )}
      </div>
      {/* Heading and Icon */}
      <div className="flex gap-x-4 items-center mb-6">
        <BrainCircuit
          className={`cursor-pointer duration-500 w-10 h-10 ${
            open && "rotate-[360deg]"
          }`}
          stroke={theme === "dark" ? "white" : "black"}
        />
        {open && (
          <Heading className="origin-left font-medium text-xl duration-200 text-gray-900 dark:text-white">
            Teacher
          </Heading>
        )}
      </div>
      {/* Menu Items */}
      <ul className="pt-6">
        {Menus.map(({ title, navigateTo, Icon, gap, clickable }) => (
          <li
            key={title}
            onClick={() => handleMenuClick(navigateTo, clickable)}
            className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 text-sm ${
              gap ? "mt-9" : "mt-2"
            } ${
              currentView === navigateTo
                ? "bg-gray-200 dark:bg-gray-700"
                : clickable
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "opacity-50"
            } ${clickable ? "" : "pointer-events-none"} ${
              open ? "" : "justify-center"
            }`}
          >
            <Icon
              width={open ? 24 : 20}
              height={open ? 24 : 20}
              stroke={theme === "dark" ? "white" : "black"}
            />
            {open && (
              <Text
                as="span"
                className="origin-left duration-200 text-gray-900 dark:text-white"
              >
                {title}
              </Text>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

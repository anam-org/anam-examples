"use client";

import { Text } from "@radix-ui/themes";
import { Book, Clipboard, Pencil, BarChart, Settings, X } from "lucide-react";
import { SidebarNavMenuItem } from "./NavigationSidebar";

const Menus: SidebarNavMenuItem[] = [
  { title: "Lessons", navigateTo: "/demo", Icon: Book, clickable: true },
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
    navigateTo: "/demo/settings",
    Icon: Settings,
    clickable: true,
    gap: true,
  },
  {
    title: "Exit",
    navigateTo: "/",
    Icon: X,
    clickable: true,
    gap: true,
  },
];

/**
 * SidebarContents component renders the sidebar menu options.
 */
export const NavigationSidebarContents = ({
  open,
  theme,
  handleMenuClick,
}: {
  open: boolean;
  theme: string | undefined;
  handleMenuClick: (navigateTo: string, clickable: boolean) => void;
}) => {
  return (
    <ul className="pt-6">
      {Menus.map(({ title, navigateTo, Icon, gap, clickable }) => (
        <li
          key={title}
          onClick={() => handleMenuClick(navigateTo, clickable)}
          className={`flex rounded-md p-2 cursor-pointer items-center gap-x-4 text-sm ${
            gap ? "mt-9" : "mt-2"
          } ${
            clickable
              ? "hover:bg-gray-100 dark:hover:bg-gray-800"
              : "opacity-50 pointer-events-none"
          } ${open ? "" : "justify-center"}`}
        >
          <Icon
            width="20"
            height="20"
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
  );
};

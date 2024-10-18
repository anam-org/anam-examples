"use client";

import { Box, Heading, IconButton } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, BrainCircuit, Menu } from "lucide-react";
import { useAnamContext } from "@/contexts";
import { usePathname, useRouter } from "next/navigation";
import { ComponentType, useState } from "react";
import { useTheme } from "next-themes";
import { logger } from "@/utils";
import { NavigationSidebarContents } from "./NavigationSidebarContents";

export interface SidebarNavMenuItem {
  title: string;
  navigateTo: string;
  Icon: ComponentType<any>;
  gap?: boolean;
  clickable: boolean;
}

/**
 * NavigationSidebar component renders the navigation sidebar with options like Lessons, Vocabulary, and Practice.
 * It supports toggling between open and collapsed states, and allows the user to navigate to different views.
 */
export const NavigationSidebar = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { anamClient } = useAnamContext();
  const { theme } = useTheme();
  const router = useRouter();
  const currentPath = usePathname();

  /**
   * Handles clicks on menu items. If the item is not clickable, it does nothing.
   * If the "Exit" menu item is clicked, it stops streaming and navigates to the initial page.
   *
   * @async
   * @function
   * @param {string} navigateTo - The view to navigate to.
   * @param {boolean} clickable - Whether the menu item is clickable.
   * @returns {Promise<void>} Resolves when the navigation is complete.
   */
  const handleMenuClick = async (navigateTo: string, clickable: boolean) => {
    if (!clickable) return;

    if (navigateTo === "/initial") {
      await handleExitClick();
    } else {
      if (currentPath === "/demo" && navigateTo !== "/demo") {
        if (anamClient) {
          await anamClient.stopStreaming().catch((error) => {
            logger.error("Failed to stop streaming:", error);
          });
        }
      }
      router.push(navigateTo);
      logger.info("stopped streaming");
    }

    setOpen(false);
  };

  /**
   * Handles the exit action by stopping the streaming and navigating to the home page.
   *
   * @async
   * @function
   * @returns {Promise<void>} Resolves when the exit action is complete.
   */
  const handleExitClick = async (): Promise<void> => {
    if (anamClient) {
      await anamClient.stopStreaming().catch(console.error);
      logger.info("Stopped streaming");
    }
    router.push("/");
    setOpen(false);
  };

  return (
    <>
      {/* Header for small screens (md and below) */}
      {!open && (
        <header className="lg:hidden w-full py-4 border-b border-gray-200 dark:border-gray-500 shadow-lg flex items-center justify-start px-4 min-h-[60px] fixed top-0 left-0 z-50">
          <IconButton
            size="4"
            onClick={() => setOpen(true)}
            className="bg-black dark:bg-white "
          >
            <Menu stroke={theme === "dark" ? "black" : "white"} />
          </IconButton>
        </header>
      )}

      {/* Sidebar */}
      <Box
        className={`fixed top-0 left-0 h-screen p-5 pt-8 z-50 bg-white dark:bg-black transition-all duration-300 border-r border-gray-200 dark:border-gray-500 shadow-lg ${
          open
            ? "w-[20vw] min-w-[200px] max-w-[400px]"
            : "w-0 lg:w-[8vw] xl:w-[6vw] 2xl:w-[4vw] min-w-[50px]"
        } ${open ? "block" : "lg:block hidden"}`}
      >
        {/* Toggle Button for large screens */}
        <Box
          className="absolute cursor-pointer -right-4 top-9 w-7 h-7 bg-black dark:bg-white border border-gray-200 dark:border-gray-700 rounded-full"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronLeft stroke={theme === "dark" ? "black" : "white"} />
          ) : (
            <ChevronRight
              stroke={theme === "dark" ? "black" : "white"}
              className="lg:block hidden"
            />
          )}
        </Box>
        {/* Heading and Icon */}
        <Box className="flex gap-x-4 items-center mb-6">
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
        </Box>
        {/* Sidebar Contents */}
        <NavigationSidebarContents
          open={open}
          theme={theme}
          handleMenuClick={handleMenuClick}
        />
      </Box>
    </>
  );
};

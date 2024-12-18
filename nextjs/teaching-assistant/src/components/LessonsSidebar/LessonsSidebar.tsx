"use client";

import { Heading, Box } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { DemoSidebarContents, lessons } from "./LessonsSidebarContent";
import { useSettingsContext } from "@/contexts";

export interface MenuItem {
  title: string;
  description: string;
  clickable: boolean;
}

/**
 * LessonsSidebar component renders a toggleable sidebar with a list of lessons based on the selected language.
 * The sidebar can be expanded or collapsed and adapts to different screen sizes.
 */
export const LessonsSidebar = (): JSX.Element => {
  const { selectedLanguage } = useSettingsContext(); // Get the selected language from the context
  const [open, setOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string>("");

  const { theme } = useTheme();

  /**
   * Sets the default lesson when the selected language changes.
   */
  useEffect(() => {
    setSelectedLesson(lessons[selectedLanguage][0].title);
  }, [selectedLanguage]);

  return (
    <Box>
      {/* Sidebar */}
      <Box
        className={`fixed top-0 right-0 z-50 h-screen p-5 pt-8 bg-white dark:bg-black transition-all duration-300 border-l shadow-lg border-gray-200 dark:border-gray-500 ${
          open
            ? "w-[20vw] min-w-[200px] max-w-[400px]"
            : "w-0 lg:w-[8vw] xl:w-[6vw] 2xl:w-[4vw] min-w-[50px]"
        } ${open ? "block" : "lg:block hidden"}`}
      >
        {/* Toggle Button */}
        <Box
          className="absolute cursor-pointer -left-4 top-9 w-7 h-7 flex items-center justify-center bg-black dark:bg-white border rounded-full"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronRight stroke={theme === "dark" ? "black" : "white"} />
          ) : (
            <ChevronLeft stroke={theme === "dark" ? "black" : "white"} />
          )}
        </Box>

        {/* Sidebar Header */}
        <Box className="flex items-center gap-x-4 mb-6 justify-end">
          {open && (
            <Heading className="text-black dark:text-white text-xl font-medium">
              Lessons
            </Heading>
          )}
          <BookOpen
            className={`dark:stroke-white cursor-pointer transition-transform ${open && "rotate-[360deg]"}`}
            size={open ? 40 : 30}
          />
        </Box>

        {/* Sidebar Contents */}
        <DemoSidebarContents
          open={open}
          lessons={lessons[selectedLanguage]}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
        />
      </Box>
    </Box>
  );
};

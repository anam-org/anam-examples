"use client";

import { Heading, Text, Box, IconButton } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, BookOpen, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const lessons: Record<string, MenuItem[]> = {
  french: [
    {
      title: "Introduction to French",
      description: "Basic greetings and phrases",
      clickable: true,
    },
    {
      title: "French Numbers",
      description: "Learn to count in French",
      clickable: false,
    },
    {
      title: "Basic Conversations",
      description: "Common questions and answers",
      clickable: false,
    },
    {
      title: "French Verbs",
      description: "Introduction to verb conjugation",
      clickable: false,
    },
    {
      title: "Everyday Vocabulary",
      description: "Essential words for daily life",
      clickable: false,
    },
  ],
  spanish: [
    {
      title: "Introduction to Spanish",
      description: "Basic greetings and phrases",
      clickable: true,
    },
    {
      title: "Spanish Numbers",
      description: "Learn to count in Spanish",
      clickable: false,
    },
    {
      title: "Basic Conversations",
      description: "Common questions and answers",
      clickable: false,
    },
    {
      title: "Spanish Verbs",
      description: "Introduction to verb conjugation",
      clickable: false,
    },
    {
      title: "Everyday Vocabulary",
      description: "Essential words for daily life",
      clickable: false,
    },
  ],
  german: [
    {
      title: "Introduction to German",
      description: "Basic greetings and phrases",
      clickable: true,
    },
    {
      title: "German Numbers",
      description: "Learn to count in German",
      clickable: false,
    },
    {
      title: "Basic Conversations",
      description: "Common questions and answers",
      clickable: false,
    },
    {
      title: "German Verbs",
      description: "Introduction to verb conjugation",
      clickable: false,
    },
    {
      title: "Everyday Vocabulary",
      description: "Essential words for daily life",
      clickable: false,
    },
  ],
};

interface MenuItem {
  title: string;
  description: string;
  clickable: boolean;
}

interface DemoSidebarProps {
  selectedLanguage: "french" | "spanish" | "german";
}

interface DemoSidebarContentsProps {
  open: boolean;
  lessons: MenuItem[];
  selectedLesson: string;
  setSelectedLesson: (lesson: string) => void;
}

const DemoSidebarContents = ({
  open,
  lessons,
  selectedLesson,
  setSelectedLesson,
}: DemoSidebarContentsProps) => {
  return (
    <ul className="space-y-2">
      {open &&
        lessons.map((lesson, index) => (
          <li
            key={index}
            onClick={() => lesson.clickable && setSelectedLesson(lesson.title)}
          >
            <Box
              className={`p-2 sm:p-3 lg:p-4 border border-gray-200 dark:border-gray-500 dark:bg-gray-700 rounded-lg shadow transition cursor-pointer ${
                lesson.clickable
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "opacity-50 pointer-events-none"
              } ${selectedLesson === lesson.title ? "bg-gray-200" : ""}`}
            >
              {/* Title*/}
              <Heading size={{ initial: "1", sm: "1", md: "1", lg: "2" }}>
                {lesson.title}
              </Heading>

              {/* Description*/}
              <Text
                size={{ initial: "1", sm: "1", md: "1", lg: "2" }}
                className="text-gray-500 hidden xl:block"
              >
                {lesson.description}
              </Text>
            </Box>
          </li>
        ))}
    </ul>
  );
};

export const DemoSidebar = ({ selectedLanguage }: DemoSidebarProps) => {
  const [open, setOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    setSelectedLesson(lessons[selectedLanguage][0].title);
  }, [selectedLanguage]);

  return (
    <Box>
      {/* Button to toggle sidebar on smaller screens */}
      {!open && (
        <Box className="lg:hidden fixed top-2 right-2 z-50">
          <IconButton
            size="4"
            onClick={() => setOpen(true)}
            className="p-2 rounded-full bg-black dark:bg-white border border-gray-200 dark:border-gray-700"
          >
            <Menu stroke={theme === "dark" ? "black" : "white"} />
          </IconButton>
        </Box>
      )}

      {/* Sidebar always rendered, with transition applied */}
      <Box
        className={`fixed top-0 right-0 z-50 h-screen p-5 pt-8 bg-white dark:bg-black border-l shadow-lg border-gray-200 dark:border-gray-500 transition-all duration-300 ${
          open
            ? "w-[20vw] min-w-[200px] max-w-[400px]"
            : "w-0 lg:w-[5vw] xl:w-[5vw] 2xl:w-[4vw] min-w-[50px]"
        } ${open ? "block" : "lg:block hidden"}`}
      >
        {/* Toggle Button */}
        <Box
          className="absolute -left-4 top-9 w-7 h-7 flex items-center justify-center bg-black dark:bg-white border rounded-full cursor-pointer"
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

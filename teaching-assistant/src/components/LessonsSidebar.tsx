"use client";

import { Heading, Text, Box } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface MenuItem {
  title: string;
  description: string;
  clickable: boolean;
}

interface LessonsSidebarProps {
  selectedLanguage: "french" | "spanish" | "german";
}

export const LessonsSidebar = ({ selectedLanguage }: LessonsSidebarProps) => {
  const [open, setOpen] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const { theme } = useTheme();

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

  useEffect(() => {
    setSelectedLesson(lessons[selectedLanguage][0].title);
  }, [selectedLanguage]);

  return (
    <div
      className={`${
        open
          ? "w-[20vw] min-w-[200px] max-w-[400px]"
          : "w-[5vw] min-w-[50px] max-w-[80px]"
      } bg-dark-purple h-screen p-5 pt-8 fixed top-0 right-0 z-50 duration-300 border-l border-gray-200 dark:border-gray-500 shadow-lg`}
    >
      {/* Toggle Button */}
      <div
        className="absolute cursor-pointer -left-3 top-9 w-7 h-7 bg-black dark:bg-white border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronRight stroke={theme === "dark" ? "black" : "white"} />
        ) : (
          <ChevronLeft stroke={theme === "dark" ? "black" : "white"} />
        )}
      </div>

      {/* Heading and Icon */}
      <div className="flex gap-x-4 items-center mb-6 justify-end">
        {open && (
          <Heading className="origin-right font-medium text-xl duration-200 text-white">
            Lessons
          </Heading>
        )}
        <BookOpen
          className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
          stroke="white"
          size={open ? 40 : 30} // Adjust size based on open state
        />
      </div>

      {/* Lessons List */}
      <ul className="pt-6 space-y-4">
        {open &&
          lessons[selectedLanguage].map((lesson, index) => (
            <li
              key={index}
              onClick={() =>
                lesson.clickable && setSelectedLesson(lesson.title)
              }
            >
              <Box
                className={`p-4 border border-gray-200 dark:border-gray-500 rounded-lg shadow transition duration-150 cursor-pointer ${
                  lesson.clickable
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                    : "opacity-50 pointer-events-none"
                } ${selectedLesson === lesson.title ? "bg-gray-200 dark:bg-gray-700" : ""}`}
              >
                <Heading size={{ sm: "1", md: "2", lg: "3" }}>
                  {lesson.title}
                </Heading>
                <Text
                  size={{ sm: "1", md: "1", lg: "2" }}
                  className="text-gray-500"
                >
                  {lesson.description}
                </Text>
              </Box>
            </li>
          ))}
      </ul>
    </div>
  );
};

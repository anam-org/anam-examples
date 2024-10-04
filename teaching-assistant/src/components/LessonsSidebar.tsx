"use client";

import { Heading, Text, Box } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface MenuItem {
  title: string;
  description: string;
  clickable: boolean;
}

export const LessonsSidebar = () => {
  const [open, setOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string>(
    "Introduction to French",
  );

  const lessons: MenuItem[] = [
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
  ];

  useEffect(() => {
    setSelectedLesson("Introduction to French");
  }, []);

  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } bg-dark-purple h-screen p-5 pt-8 relative duration-300 border-l border-gray-200 shadow-lg ml-auto`}
    >
      {/* Toggle Button */}
      <div
        className={`absolute cursor-pointer -left-3 top-9 w-7 bg-black border-gray-200
           border-2 rounded-full`}
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronRight color="white" /> : <ChevronLeft color="white" />}
      </div>

      {/* Heading and Icon */}
      <div className="flex gap-x-4 items-center mb-6 justify-end">
        {open && (
          <Heading className="origin-right font-medium text-xl duration-200">
            Lessons
          </Heading>
        )}
        <img
          src="/icons/BookOpenText.svg"
          className={`cursor-pointer duration-500 w-10 h-10 ${
            open && "rotate-[360deg]"
          }`}
        />
      </div>

      {/* Lessons List */}
      <ul className="pt-6 space-y-4">
        {open &&
          lessons.map((lesson, index) => (
            <li
              key={index}
              onClick={() =>
                lesson.clickable && setSelectedLesson(lesson.title)
              }
            >
              <Box
                className={`p-4 border border-gray-200 rounded-lg shadow transition duration-150 cursor-pointer ${
                  lesson.clickable
                    ? "hover:bg-gray-100"
                    : "opacity-50 pointer-events-none"
                } ${selectedLesson === lesson.title ? "bg-gray-200" : ""}`}
              >
                <Heading size="3">{lesson.title}</Heading>
                <Text size="2" className="text-gray-500">
                  {lesson.description}
                </Text>
              </Box>
            </li>
          ))}
      </ul>
    </div>
  );
};

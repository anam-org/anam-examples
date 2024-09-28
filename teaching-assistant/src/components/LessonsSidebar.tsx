"use client";

import { Heading, Text, Box } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useViewContext } from "@/contexts";
import { useState } from "react";

export const LessonsSidebar = () => {
  const [open, setOpen] = useState(false);
  const { currentView, changeView } = useViewContext();

  const lessons = [
    {
      title: "Introduction to French",
      description: "Basic greetings and phrases",
    },
    { title: "French Numbers", description: "Learn to count in French" },
    {
      title: "Basic Conversations",
      description: "Common questions and answers",
    },
    { title: "French Verbs", description: "Introduction to verb conjugation" },
    {
      title: "Everyday Vocabulary",
      description: "Essential words for daily life",
    },
  ];

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
          <Heading
            className="origin-right font-medium text-xl duration-200"
          >
            Lessons
          </Heading>
        )}
        <img
          src="/icons/BookOpenText.svg"
          className={`cursor-pointer duration-500 w-10 h-10 ${open && "rotate-[360deg]"}`}
        />
      </div>

      {/* Lessons List */}
      <ul className="pt-6 space-y-4">
        {open && lessons.map((lesson, index) => (
          <li key={index} onClick={() => changeView(lesson.title)}>
            <Box
              className={`p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition duration-150 cursor-pointer ${
                currentView === lesson.title ? "bg-gray-200" : ""
              }`}
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

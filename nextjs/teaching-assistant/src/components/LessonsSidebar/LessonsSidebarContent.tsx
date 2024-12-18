import { Box, Heading, Text } from "@radix-ui/themes";
import { MenuItem } from "./LessonsSidebar";

export const lessons: Record<string, MenuItem[]> = {
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

interface DemoSidebarContentsProps {
  open: boolean;
  lessons: MenuItem[];
  selectedLesson: string;
  setSelectedLesson: (lesson: string) => void;
}

/**
 * DemoSidebarContents renders the list of lessons in the sidebar based on the selected language.
 * Users can select a lesson, but only clickable lessons are selectable.
 */
export const DemoSidebarContents = ({
  open,
  lessons,
  selectedLesson,
  setSelectedLesson,
}: DemoSidebarContentsProps): JSX.Element => {
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
              <Heading size={{ initial: "1", sm: "1", md: "1", lg: "2" }}>
                {lesson.title}
              </Heading>
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

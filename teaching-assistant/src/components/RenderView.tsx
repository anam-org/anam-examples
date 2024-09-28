"use client";

import { useViewContext } from "@/contexts";
import { LessonsView } from "@/app/_views";
import { InitialView } from "@/app/_views/Initial";

const VocabularyView = () => <div>Vocabulary Placeholder</div>;
const PracticeView = () => <div>Practice Placeholder</div>;
const ProgressView = () => <div>Progress Placeholder</div>;
const SettingsView = () => <div>Settings Placeholder</div>;

export const ViewRenderer = () => {
  const { currentView } = useViewContext();

  const renderView = () => {
    switch (currentView) {
      case "Lessons":
        return <LessonsView />;
      case "Vocabulary":
        return <VocabularyView />;
      case "Practice":
        return <PracticeView />;
      case "Progress":
        return <ProgressView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <InitialView />;
    }
  };

  return <>{renderView()}</>;
};

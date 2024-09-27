"use client";

import { useViewContext } from "@/contexts";
import { LessonsView } from "../_views/lessons/Lessons";

const VocabularyView = () => <div>Vocabulary Placeholder</div>;
const PracticeView = () => <div>Practice Placeholder</div>;
const ProgressView = () => <div>Progress Placeholder</div>;
const SettingsView = () => <div>Settings Placeholder</div>;

const ViewRenderer = () => {
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
        return <div>Select a view from the sidebar</div>;
    }
  };

  return <>{renderView()}</>;
};

export default ViewRenderer;

"use client";

import { ViewContextProvider, useViewContext } from "@/contexts";
import { InitialView, LessonsView } from "./_views";
import { NavigationSidebar } from "@/components";

export default function HomePage() {
  return (
    <ViewContextProvider>
      <Content />
    </ViewContextProvider>
  );
}

function Content() {
  const { currentView } = useViewContext();

  const renderView = () => {
    switch (currentView) {
      case "Lessons":
        return <LessonsView />;
      default:
        return <InitialView />;
    }
  };

  return (
    <div className="flex h-screen">
      {currentView === "Lessons" && <NavigationSidebar />}
      <main className="flex-grow overflow-hidden">{renderView()}</main>
    </div>
  );
}

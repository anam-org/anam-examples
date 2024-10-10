"use client";

import { ViewContextProvider, useViewContext } from "@/contexts";
import { LessonsView, SettingsView } from "./_views";
import { NavigationSidebar } from "@/components";

export default function DemoPage() {
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
      case "Settings":
      default:
        return <SettingsView />;
    }
  };

  return (
    <div className="flex h-screen">
      <NavigationSidebar />
      <main className="flex-grow overflow-hidden">{renderView()}</main>
    </div>
  );
}

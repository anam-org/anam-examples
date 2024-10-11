"use client";

import { ViewContextProvider, useViewContext } from "@/contexts";
import { DemoView, SettingsView } from "./_views";
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
      case "Demo":
        return <DemoView />;
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

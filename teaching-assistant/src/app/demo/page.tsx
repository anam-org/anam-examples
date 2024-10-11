"use client";

import { useViewContext } from "@/contexts";
import { DemoView, SettingsView } from "./_views";
import { NavigationSidebar } from "@/components";

export default function DemoPage() {
  const { currentView } = useViewContext();

  const renderView = () => {
    switch (currentView) {
      case "Settings":
        return <SettingsView />;
      case "Demo":
      default:
        return <DemoView />;
    }
  };

  return (
    <div className="flex h-screen">
      <NavigationSidebar />
      <main className="flex-grow overflow-hidden">{renderView()}</main>
    </div>
  );
}

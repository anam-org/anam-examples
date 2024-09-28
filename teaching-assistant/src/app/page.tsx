"use client";

import { Sidebar } from "../components/Sidebar";
import { ViewRenderer } from "@/components";
import { ViewContextProvider, useViewContext } from "@/contexts";

export default function HomePage() {
  return (
    <ViewContextProvider>
      <div className="flex h-screen">
        <ConditionalSidebar />
        <main className="flex-grow overflow-hidden">
          <ViewRenderer />
        </main>
      </div>
    </ViewContextProvider>
  );
}

function ConditionalSidebar() {
  const { currentView } = useViewContext();
  if (currentView === "Initial") {
    return null;
  }
  return <Sidebar />;
}

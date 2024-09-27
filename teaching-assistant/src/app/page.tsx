"use client";

import { ViewContextProvider } from "@/contexts";
import { Sidebar } from "./_components/Sidebar";
import ViewRenderer from "./_components/RenderView";

export default function HomePage() {
  return (
    <ViewContextProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-grow">
          <ViewRenderer />
        </main>
      </div>
    </ViewContextProvider>
  );
}

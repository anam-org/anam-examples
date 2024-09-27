"use client";

import ViewRenderer from "@/components/ViewRenderer";
import { ViewContextProvider } from "@/contexts/ViewContext";

export default function HomePage() {
  return (
    <ViewContextProvider>
      <div className="flex h-screen">
        <main className="flex-grow">
          <ViewRenderer />
        </main>
      </div>
    </ViewContextProvider>
  );
}
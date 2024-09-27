"use client";

import { ViewRenderer } from "@/components";
import { ViewContextProvider } from "@/contexts";

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

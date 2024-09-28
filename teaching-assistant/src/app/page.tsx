"use client";

import { ViewContextProvider } from "@/contexts";
import { Sidebar } from "../components/Sidebar";
import { ViewRenderer } from "@/components";

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

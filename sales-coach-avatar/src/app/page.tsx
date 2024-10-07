"use client";

import { ViewRenderer } from "@/components";

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <main className="flex-grow">
        <ViewRenderer />
      </main>
    </div>
  );
}

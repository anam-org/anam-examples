import { LessonsSidebar, NavigationSidebar } from "@/components";
import { ReactNode } from "react";

export default function DemoLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main>
      <NavigationSidebar />
      {children}
      <LessonsSidebar />
    </main>
  );
}

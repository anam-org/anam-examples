"use client";

import { SettingsContextProvider } from "@/contexts";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SettingsContextProvider>{children}</SettingsContextProvider>;
}

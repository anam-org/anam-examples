import "@radix-ui/themes/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Theme } from "@radix-ui/themes";
import { Providers } from "@/providers";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "ANAM AI",
  description: "teaching assistant demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Providers>
          <ThemeProvider attribute="class">
            <Theme
              accentColor="gray"
              grayColor="slate"
              scaling="110%"
              radius="large"
            >
              {children}
            </Theme>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

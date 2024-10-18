import "@radix-ui/themes/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Theme } from "@radix-ui/themes";
import { Providers } from "./_providers";

export const metadata: Metadata = {
  title: "Sales Coach Example",
  description: "Example of Anam SDK being used",
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
          <Theme
            accentColor="mint"
            grayColor="slate"
            scaling="110%"
            radius="large"
          >
            {children}
          </Theme>
        </Providers>
      </body>
    </html>
  );
}

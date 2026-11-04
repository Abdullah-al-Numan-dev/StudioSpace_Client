import type { Metadata } from "next";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudioSpace | Book Creative Studios by the Hour",
  description:
    "Discover and reserve photo studios, sound stages, podcast lounges, music suites, and art workshops from verified hosts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-base-100 text-base-content">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
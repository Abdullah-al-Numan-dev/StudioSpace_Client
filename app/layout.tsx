import type { Metadata } from "next";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import WishlistProvider from "@/components/WishlistProvider";

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
      <body className="flex min-h-screen flex-col bg-base-100 text-base-content">
        <ThemeProvider>
          <WishlistProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
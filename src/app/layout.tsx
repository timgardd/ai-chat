import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assignment 05: Next.js Chat",
  description: "Migrated from Vite to Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 h-screen overflow-hidden flex">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}

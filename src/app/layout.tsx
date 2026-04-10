import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assignment 06: React Query Chat",
  description: "Prisma and TanStack Query enabled",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-gray-900 h-screen overflow-hidden flex" suppressHydrationWarning>
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

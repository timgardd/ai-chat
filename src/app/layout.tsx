import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import SidebarSkeleton from "@/components/Sidebar/SidebarSkeleton";
import Providers from "@/components/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat App",
  description: "Progressive Web App enabled AI Chat",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Chat",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-gray-900 h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row" suppressHydrationWarning>
        <Providers>
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}

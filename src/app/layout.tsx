import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ModalRenderer } from "@/components/modals/ModalRenderer";
import { Toaster } from "@/components/ui/Toaster";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DG Terminal",
  description: "Production-ready Next.js frontend scaffold",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <TopBar />
        <div className="mx-auto w-full max-w-[1400px]">
          {children}
        </div>
        <ModalRenderer />
        <Toaster />
      </body>
    </html>
  );
}

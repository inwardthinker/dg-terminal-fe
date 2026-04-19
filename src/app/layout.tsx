import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ModalRenderer } from "@/components/modals/ModalRenderer";
import { Toaster } from "@/components/ui/Toaster";

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
      <body>
        <div className="mx-auto w-full max-w-[1280px] px-4 max-sm:px-0">
          {children}
        </div>
        <ModalRenderer />
        <Toaster />
      </body>
    </html>
  );
}

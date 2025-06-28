import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyHive",
  description: "AI Powered Study Notes Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="bottom-right"
          theme="light"
          className="toaster"
          toastOptions={{
            classNames: {
              toast: "bg-background border-border text-foreground",
              success: "bg-success text-white border-success",
              error: "bg-danger text-white border-danger",
              warning: "bg-warning text-foreground border-warning",
              info: "bg-info text-white border-info",
            },
          }}
        />
      </body>
    </html>
  );
}

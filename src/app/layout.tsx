// src/app/layout.tsx
// This is the root layout for your Next.js App Router application.
// It defines the HTML structure, global styles, and metadata.

import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css"; 
import Navbar from "../components/Navbar"; 
import Footer from "@/components/Footer";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the application
export const metadata: Metadata = {
  title: "Bible Nav",
  description: "Navigate the Bible and manage your favorite verses.",
};

export default function RootLayout({
  children, // children will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply min-h-screen and flex-col to the body to enable sticky footer */}
      {/* Background image remains fixed for a modern, immersive feel */}
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-cover bg-center bg-fixed`}
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/E0F2FE/6B46C1?text=Open+Bible+Light+Path')",
        }}
      >
        <Navbar />
        <div className="flex-1 flex flex-col pt-24 bg-white bg-opacity-20 backdrop-blur-sm">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

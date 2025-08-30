import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bible Nav",
  description: "Navigate the Bible and manage your favorite verses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} min-h-screen relative`}>
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/nav-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 flex flex-col pt-24 bg-white bg-opacity-20 backdrop-blur-sm">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

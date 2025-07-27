// This is the root layout for the Next.js App Router application.
// It defines the HTML structure, global styles, and metadata.

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import './globals.css'; 

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

// Define metadata for the application
export const metadata: Metadata = {
  title: 'Bible Nav',
  description: 'Navigate the Bible and manage your favorite verses.',
};

export default function RootLayout({
  children, // children will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The children prop will render the content of your pages */}
        {children}
      </body>
    </html>
  );
}

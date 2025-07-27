// src/components/Footer.tsx
// This component provides the global footer for the application.

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-center w-full h-16 border-t mt-auto bg-white text-gray-600 shadow-inner">
      <a
        className="flex items-center justify-center gap-2 text-sm"
        href="https://github.com/vanheaven-ui" 
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by Bible Nav API & Next.js
      </a>
    </footer>
  );
};

export default Footer;

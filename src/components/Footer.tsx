import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="flex items-center justify-center w-full h-16 border-t mt-auto bg-white text-gray-600 shadow-inner">
      <div className="flex items-center justify-center gap-2 text-sm">
        <a
          href="https://github.com/vanheaven-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          Built by vanheaven-ui
        </a>
        <span className="text-gray-400">|</span> {/* A small separator */}
        <span className="flex items-center justify-center gap-2">
          Powered by Bible Nav API & Next.js
        </span>
      </div>
    </footer>
  );
};

export default Footer;

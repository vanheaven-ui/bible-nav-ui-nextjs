"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import AIChat from "./AiChat";

const AIChatDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const drawerRef = useRef<HTMLDivElement>(null);

  // Update drag constraints based on viewport size and drawer size
  const updateConstraints = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const drawerWidth = drawerRef.current?.offsetWidth || 0;
    const drawerHeight = drawerRef.current?.offsetHeight || 0;

    setConstraints({
      top: 0,
      left: 0,
      right: width - drawerWidth,
      bottom: height - drawerHeight,
    });
  };

  useEffect(() => {
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [drawerRef.current?.offsetWidth, drawerRef.current?.offsetHeight]);

  return (
    <>
      {/* Floating Button with Tooltip */}
      <div className="fixed bottom-8 right-8 z-50 group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#a4161a] text-white shadow-xl hover:bg-[#822121] transition-all duration-300 transform hover:scale-110"
          aria-label="Open AI Chat"
        >
          <Sparkles size={28} />
        </button>
        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm font-medium text-white bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Ask AI
        </span>
      </div>

      {/* Draggable Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag
            dragConstraints={constraints}
            dragElastic={0.2}
            dragMomentum={true}
            className="fixed top-[var(--navbar-height,64px)] right-8 z-40 w-full max-w-md md:max-w-lg lg:max-w-xl cursor-grab"
          >
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#6b705c]/20 overflow-hidden max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#6b705c]/20 cursor-grab">
                <h3 className="text-xl font-bold text-[#6b705c] flex items-center gap-2">
                  <Sparkles className="text-[#d4af37]" size={20} />
                  Sacred AI Chat
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#6b705c] hover:text-[#a4161a] transition"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto flex-1">
                <AIChat />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatDrawer;

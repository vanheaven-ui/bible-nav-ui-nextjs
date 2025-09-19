"use client";

import React, { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { askAI } from "@/lib/backendApi";

const AIChat: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("Thinking...");

    try {
      const data = await askAI(question);
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("⚠️ Error: Could not retrieve an answer. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 text-[#2d2a26] overflow-x-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      ></div>
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/90"></div>

      {/* Sacred Glow */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-[#d4af37]/25 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#a4161a]/25 blur-[120px]" />
      </div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-gradient-to-br from-[#fdfbf6] to-[#f9f5e7]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#6b705c]/20 overflow-hidden overflow-x-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-[#6b705c]/20 bg-[#6b705c]/10 hover:bg-[#6b705c]/20 transition"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#6b705c] flex items-center gap-2">
            <Sparkles className="text-[#d4af37]" size={22} />
            Sacred AI Chat
          </h2>

          {/* Animated Caret with Hover, Click, and Pulsing Glow */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="cursor-pointer relative"
            whileHover={{ y: -2, scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulsing Glow when closed */}
            {!isOpen && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: "0 0 8px rgba(212,175,55,0.6)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.3, 0.7] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            )}
            <ChevronDown className="text-[#6b705c] relative z-10" size={20} />
          </motion.div>
        </button>

        {/* Expandable Section */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* Answer Display */}
              <div className="p-6 min-h-[200px] max-h-[400px] overflow-y-auto font-serif italic text-lg leading-relaxed text-[#2d2a26] break-words">
                {answer ? (
                  <span className="break-words">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </span>
                ) : (
                  <p className="text-[#495057] font-sans break-words">
                    Ask a question about the{" "}
                    <span className="font-semibold text-[#a4161a]">Bible</span>…
                  </p>
                )}
              </div>

              {/* Question Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3 border-t border-[#6b705c]/20 px-6 py-4 bg-[#fdfbf6]/70"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What does the book of Romans talk about?"
                  className="flex-grow p-3 rounded-full border border-[#6b705c]/30 bg-white/70 shadow-inner focus:ring-2 focus:ring-[#d4af37] text-sm sm:text-base min-w-0 break-words"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full font-semibold text-white bg-[#a4161a] hover:bg-[#822121] shadow-lg transition disabled:bg-[#a4161a]/50"
                  disabled={loading}
                >
                  {loading ? "🕯️ Thinking..." : "Ask"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIChat;

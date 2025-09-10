"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(pathname !== "/");
  }, [pathname]);

  if (!showButton) return null;

  return (
    <div className="w-full flex justify-start mt-4 sm:mt-6 px-6 sm:px-10 z-30">
      <button
        onClick={() => router.back()}
        className="
          flex items-center gap-2 px-4 py-2
          bg-gradient-to-r from-[#d4af37]/40 via-[#a4161a]/30 to-[#6b705c]/30
          text-[#fffaf0] font-semibold rounded-xl shadow-lg
          backdrop-blur-md hover:scale-105 hover:shadow-2xl transition-transform duration-300
          border border-[#d4af37]/40
        "
        title="Go Back"
      >
        <ChevronLeft size={20} className="text-[#fffaf0]" />
        <span className="hidden sm:inline">Back</span>
      </button>
    </div>
  );
}

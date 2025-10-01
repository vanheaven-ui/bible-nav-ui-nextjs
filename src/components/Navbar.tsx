"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useVerseStore } from "../store/verseStore";
import { signOut } from "next-auth/react";

// --- Interface Definitions (Unchanged) ---
interface MenuItem {
  name: string;
  href: string;
  authenticated: boolean;
  icon: string;
}
interface ActionLink {
  name: string;
  href: string;
  type: "link";
  icon: string;
}
interface ActionButton {
  name: string;
  onClick: () => void;
  type: "button";
  icon: string;
}
type AuthAction = ActionLink | ActionButton;

const Navbar: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { hasNewVerse } = useVerseStore();
  const router = useRouter();
  const pathname = usePathname();
  // We use `isMobileMenuOpen` to control the mobile-specific peel animation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect with kinetic rotation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler (Updated to use isMobileMenuOpen)
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      clearAuth();
      setIsMobileMenuOpen(false); // Close the mobile menu after logout
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems: MenuItem[] = [
    { name: "Books", href: "/books", authenticated: false, icon: "📖" },
    { name: "Favorites", href: "/favorites", authenticated: true, icon: "⭐" },
  ];

  const authActions: AuthAction[] = isAuthenticated
    ? [{ name: "Logout", onClick: handleLogout, type: "button", icon: "🚪" }]
    : [
        { name: "Login", href: "/login", type: "link", icon: "🔑" },
        { name: "Sign Up", href: "/signup", type: "link", icon: "✍️" },
      ];

  const baseClasses = "transition-all duration-500 ease-in-out";

  // Render menu items
  const renderMenuItems = (isMobile = false) =>
    menuItems.map(
      (item) =>
        (!item.authenticated || isAuthenticated) && (
          <Link
            key={item.name}
            href={item.href}
            onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
            className={`
              relative z-20 flex items-center space-x-2 font-medium 
              ${
                isMobile
                  ? "text-lg justify-start w-full px-6 py-3"
                  : "px-4 py-2 text-sm md:py-1"
              }
              ${baseClasses}
              ${
                pathname === item.href
                  ? "bg-[#6b2e2e] text-white shadow-md transform translate-y-[-2px] hover:translate-y-[-2px]"
                  : "text-[#6b2e2e] hover:bg-[#a17373]/10 transform hover:translate-y-[-1px]"
              }
              rounded-full
            `}
          >
            <span>{item.icon}</span>
            <span className={`${isMobile ? "flex-grow" : ""}`}>
              {item.name}
            </span>
          </Link>
        )
    );

  // Render auth actions for the vertical pill module (Desktop Only)
  const renderDesktopAuthActions = () => (
    <div
      className={`
            hidden lg:flex flex-col space-y-2 p-2 rounded-full border border-[#d4bfa3] shadow-lg
            bg-[#f4e7e0]/70 backdrop-blur-sm transform hover:translate-y-[-2px] ${baseClasses}
            ${isAuthenticated ? "w-24" : "w-28"}
        `}
    >
      {authActions.map((action) =>
        action.type === "button" ? (
          <button
            key={action.name}
            onClick={(action as ActionButton).onClick}
            className="w-full text-center py-1.5 bg-[#800000] text-white rounded-full text-xs font-bold hover:bg-[#6b2e2e] transition-colors"
          >
            {action.name}
          </button>
        ) : (
          <Link
            key={action.name}
            href={(action as ActionLink).href}
            className={`w-full text-center py-1.5 rounded-full text-xs font-bold transition-colors 
              ${
                action.name === "Login"
                  ? "bg-[#cfa06b] text-white hover:bg-[#b5834c]"
                  : "bg-[#6b2e2e] text-white hover:bg-[#800000]"
              }
            `}
          >
            {action.name}
          </Link>
        )
      )}
    </div>
  );

  // Render Auth Actions for Mobile Menu
  const renderMobileAuthActions = () => (
    <div className="flex flex-col w-full space-y-3 mt-8">
      {authActions.map((action) =>
        action.type === "button" ? (
          <button
            key={action.name}
            onClick={(action as ActionButton).onClick}
            className="w-full py-2 bg-[#800000] text-white rounded-lg font-bold hover:bg-[#6b2e2e] transition-colors shadow-md"
          >
            {action.name}
          </button>
        ) : (
          <Link
            key={action.name}
            href={(action as ActionLink).href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`w-full text-center py-2 rounded-lg font-bold transition-colors shadow-md
                    ${
                      action.name === "Login"
                        ? "bg-[#cfa06b] text-white hover:bg-[#b5834c]"
                        : "bg-[#6b2e2e] text-white hover:bg-[#800000]"
                    }
                    `}
          >
            {action.name}
          </Link>
        )
      )}
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 w-full z-50 ${baseClasses}`}>
      {/* ==================================================================== */}
      {/* DESKTOP/LARGE SCREEN NAVBAR (Kinetic Scroll Ribbon) */}
      {/* ==================================================================== */}
      <nav
        className={`hidden lg:flex relative max-w-7xl mx-auto ${
          isScrolled
            ? "mt-1.5 shadow-xl rotate-[0.5deg]"
            : "mt-3 shadow-2xl rotate-[-0.5deg]"
        } border-b-2 border-t-2 border-[#cfa06b]/50 rounded-[3rem] 
        items-center justify-between px-4 sm:px-6 lg:px-8 h-16 ${baseClasses} transform origin-top-left
        `}
      >
        {/* Base Shadow Layer */}
        <div
          className={`absolute inset-0 rounded-[3rem] -z-20 ${
            isScrolled ? "bg-gray-50/80" : "bg-[#f8f1e7]"
          } ${baseClasses}`}
        ></div>

        {/* Main Ribbon Layer */}
        <div
          className={`absolute inset-0 rounded-[3rem] -z-10 border border-[#d4bfa3] ${
            isScrolled
              ? "bg-gray-50/80 backdrop-blur-sm"
              : "bg-gradient-to-r from-[#f4e7e0] to-[#f2e2d2] border-t-2 border-white/50"
          } ${baseClasses} shadow-inner-lg`}
        >
          {/* Subtle Red Shape */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 
            rounded-full bg-[#800000]/5 filter blur-3xl pointer-events-none ${baseClasses}
            ${isScrolled ? "opacity-0" : "opacity-100"}`}
          ></div>
        </div>

        {/* Content */}
        <Link
          href="/"
          className={`relative z-20 flex items-center space-x-2 font-extrabold flex-shrink-0 group ${
            isScrolled ? "text-xl" : "text-2xl"
          } ${baseClasses} text-[#6b2e2e]`}
        >
          <div className="relative">
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#a17373] group-hover:bg-[#8b3d3d] ${baseClasses}`}
            ></span>
            <span
              className={`relative z-10 text-4xl group-hover:scale-110 ${baseClasses}`}
            >
              📜
            </span>
          </div>
          <span className="tracking-wide">Bible Nav</span>
        </Link>

        <div className="flex items-center space-x-2 relative z-20 h-full">
          <div className="flex items-center space-x-2 p-1 bg-[#f4e7e0]/50 rounded-full shadow-inner">
            {renderMenuItems()}
          </div>
        </div>

        <div className="flex items-center space-x-4 relative z-20">
          {isAuthenticated ? (
            <span className="relative font-semibold text-sm px-4 py-2 text-[#6b2e2e] bg-[#f4e7e0]/50 rounded-full shadow-inner">
              Hello, {user?.username || "Seeker"}!
              {hasNewVerse && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </span>
          ) : null}
          {renderDesktopAuthActions()}
        </div>
      </nav>

      {/* ==================================================================== */}
      {/* MOBILE/MEDIUM SCREEN NAVBAR (Fixed Header + Peeling Scroll Tab) */}
      {/* ==================================================================== */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-[#f8f1e7]/95 to-[#f2e2d2]/95 backdrop-blur-sm border-b border-[#d4bfa3] shadow-md flex items-center justify-between px-4 z-50`}
      >
        {/* Logo (Standard for small screens) */}
        <Link
          href="/"
          className="flex items-center space-x-2 font-extrabold text-2xl text-[#6b2e2e]"
        >
          <span className="text-4xl">📜</span>
          <span className="tracking-wide">Bible Nav</span>
        </Link>

        {/* Mobile Menu Tab Button (Unique Design) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`relative p-3 rounded-l-full bg-[#cfa06b] text-white hover:bg-[#b5834c] transition-all duration-300 focus:outline-none shadow-lg
          ${isMobileMenuOpen ? "transform -translate-x-2" : ""}`}
          aria-label="Toggle navigation"
        >
          {/* Icon using existing SVGs */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* PEELING SCROLL TAB MENU */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[80%] max-w-sm pt-20 pb-4 
          bg-gradient-to-b from-[#f4e7e0] to-[#f2e2d2] border-l-4 border-b-4 border-[#cfa06b] shadow-2xl z-40
          transform transition-transform duration-500 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col items-start space-y-2 p-6 h-full">
          {/* User Greeting */}
          {isAuthenticated && (
            <span className="relative font-semibold text-lg px-4 py-2 text-[#6b2e2e] bg-[#f4e7e0] rounded-full shadow-inner mb-4 w-full text-center">
              Hello, {user?.username || "Seeker"}!
              {hasNewVerse && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </span>
          )}

          {/* Menu Links */}
          <div className="flex flex-col w-full space-y-3 border-b border-[#d4bfa3] pb-4">
            {renderMenuItems(true)}
          </div>

          {/* Auth Actions (Login/Signup/Logout) */}
          <div className="mt-auto w-full">{renderMobileAuthActions()}</div>
        </div>
      </div>

      {/* Overlay to close menu on tap */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useVerseStore } from "../store/verseStore";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
    setIsOpen(false);
  };

  const menuItems: MenuItem[] = [
    { name: "Books", href: "/books", authenticated: false, icon: "📖" },
    { name: "Favorites", href: "/favorites", authenticated: true, icon: "⭐" },
  ];

  const authActions: AuthAction[] = isAuthenticated
    ? [
        {
          name: "Logout",
          onClick: handleLogout,
          type: "button",
          icon: "🚪",
        } as AuthAction,
      ]
    : [
        {
          name: "Login",
          href: "/login",
          type: "link",
          icon: "🔑",
        } as AuthAction,
        {
          name: "Sign Up",
          href: "/signup",
          type: "link",
          icon: "✍️",
        } as AuthAction,
      ];

  const baseClasses = "transition-all duration-500 ease-in-out";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 ${baseClasses}`}>
      <nav
        className={`relative max-w-7xl mx-auto rounded-[3rem] ${
          isScrolled
            ? "py-0.5 mt-0.5 shadow-xl bg-gray-50/70 backdrop-blur-md"
            : "py-2 mt-2 shadow-2xl bg-gradient-to-r from-[#f8f1e7] to-[#f2e2d2]"
        } border border-[#d4bfa3] flex items-center justify-between px-4 sm:px-6 lg:px-8 ${baseClasses}`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`relative z-10 flex items-center space-x-2 font-extrabold flex-shrink-0 group ${
            isScrolled ? "text-xl" : "text-2xl"
          } ${baseClasses} text-[#6b2e2e]`}
        >
          <div className="relative">
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-10 h-10 rounded-full bg-[#a17373] group-hover:bg-[#8b3d3d] ${baseClasses}`}
            ></span>
            <span
              className={`relative z-10 text-4xl group-hover:scale-110 ${baseClasses}`}
            >
              📜
            </span>
          </div>
          <span className="tracking-wide">Bible Nav</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-4 p-2 bg-[#f4e7e0]/50 rounded-full shadow-inner">
            {menuItems.map(
              (item) =>
                (!item.authenticated || isAuthenticated) && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                      pathname === item.href
                        ? "bg-[#800000] text-white shadow-lg"
                        : "text-[#6b2e2e] hover:bg-[#660000]/20 hover:text-white"
                    }`}
                  >
                    <span className="mr-2 text-xl">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )
            )}
          </div>

          {isAuthenticated && (
            <span className="relative text-sm font-semibold text-[#6b2e2e] bg-[#f4e7e0]/50 px-4 py-2 rounded-full shadow-inner">
              Hello, {user?.username || "Seeker"}!
              {hasNewVerse && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </span>
          )}

          {authActions.map((action) =>
            action.type === "button" ? (
              <button
                key={action.name}
                onClick={(action as ActionButton).onClick}
                className="px-6 py-2 bg-[#6b2e2e] text-white rounded-full hover:bg-[#800000] shadow-lg font-bold transition-colors"
              >
                {action.name}
              </button>
            ) : (
              <Link
                key={action.name}
                href={(action as ActionLink).href}
                className={`px-6 py-2 rounded-full font-bold shadow-lg transition-colors ${
                  action.name === "Login"
                    ? "bg-[#cfa06b] text-white hover:bg-[#b5834c]"
                    : "bg-[#6b2e2e] text-white hover:bg-[#800000]"
                }`}
              >
                {action.name}
              </Link>
            )
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#6b2e2e] hover:text-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000] rounded-full bg-[#f4e7e0]/50 transition-colors"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden py-4 bg-[#f4e7e0]/90 backdrop-blur-md rounded-b-3xl shadow-lg mt-1">
          <div className="flex flex-col items-center space-y-4">
            {menuItems.map(
              (item) =>
                (!item.authenticated || isAuthenticated) && (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 text-[#6b2e2e] font-medium text-lg transition-colors duration-300 ${
                      pathname === item.href
                        ? "bg-[#800000]/80 px-4 py-2 rounded-full text-white"
                        : "hover:bg-[#660000]/20 hover:text-white px-4 py-2 rounded-full"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
            )}
            {isAuthenticated && (
              <span className="relative text-lg font-bold text-[#6b2e2e] mt-4">
                Hello, {user?.username || "Seeker"}!
                {hasNewVerse && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </span>
            )}
            <div className="flex space-x-4 mt-4">
              {authActions.map((action) =>
                action.type === "button" ? (
                  <button
                    key={action.name}
                    onClick={(action as ActionButton).onClick}
                    className="px-4 py-2 bg-[#6b2e2e] text-white rounded-full font-bold hover:bg-[#800000] transition-colors"
                  >
                    {action.name}
                  </button>
                ) : (
                  <Link
                    key={action.name}
                    href={(action as ActionLink).href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 rounded-full font-bold transition-colors ${
                      action.name === "Login"
                        ? "bg-[#cfa06b] text-white hover:bg-[#b5834c]"
                        : "bg-[#6b2e2e] text-white hover:bg-[#800000]"
                    }`}
                  >
                    {action.name}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

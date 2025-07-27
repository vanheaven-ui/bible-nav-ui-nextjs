// src/components/Navbar.tsx
// This component provides the global navigation bar for the application.

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to handle scroll event for dynamic Navbar styling
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled down more than 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
    setIsOpen(false);
  };

  return (
    // Fixed header for sticky effect and backdrop blur
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-gray-50 bg-opacity-90 backdrop-blur-sm transition-all duration-300
      ${isScrolled ? "py-0.5 shadow-lg" : "py-1 shadow-md"}`}
    >
      {/* Inner nav: "floating card" appearance, centered, with dynamic styling */}
      <nav
        className={`max-w-7xl mx-auto rounded-xl border border-blue-200 flex items-center justify-between transition-all duration-300
        ${
          isScrolled
            ? "my-0.5 p-1 sm:p-1.5 lg:p-2 bg-blue-100"
            : "my-1 p-2 sm:p-2.5 lg:p-3 bg-blue-50"
        }`}
      >
        {/* Logo/Brand with dynamic size on scroll */}
        <Link
          href="/"
          className={`flex items-center space-x-2 text-blue-800 hover:text-blue-900 transition-colors flex-shrink-0
          ${isScrolled ? "text-xl" : "text-2xl"}`}
        >
          {/* SVG Logo */}
          <svg
            width={isScrolled ? "30" : "40"}
            height={isScrolled ? "30" : "40"}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="title desc"
            role="img"
          >
            <title id="title">Bible Nav Logo</title>
            <desc id="desc">
              A stylized open book with a compass needle, representing Bible
              navigation.
            </desc>

            <circle
              cx="50"
              cy="50"
              r="48"
              fill="#E0F2FE"
              stroke="#6B46C1"
              strokeWidth="2"
            />

            <path
              d="M25 25 L50 20 L75 25 L75 75 L50 80 L25 75 Z"
              fill="#FFFFFF"
              stroke="#805AD5"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M50 20 L50 80"
              stroke="#6B46C1"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <line
              x1="30"
              y1="35"
              x2="45"
              y2="33"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            <line
              x1="30"
              y1="45"
              x2="45"
              y2="43"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            <line
              x1="30"
              y1="55"
              x2="45"
              y2="53"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            <line
              x1="30"
              y1="65"
              x2="45"
              y2="63"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />

            <line
              x1="55"
              y1="33"
              x2="70"
              y2="35"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            <line
              x1="55"
              y1="43"
              x2="70"
              y2="45"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            <line
              x1="55"
              y1="53"
              x2="70"
              y2="55"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />
            <line
              x1="55"
              y1="63"
              x2="70"
              y2="65"
              stroke="#CBD5E0"
              strokeWidth="1.5"
            />

            {/* Compass Needle */}
            <path
              d="M50 30 L53 45 L50 50 L47 45 Z"
              fill="#F6AD55"
              stroke="#D69E2E"
              strokeWidth="1.5"
            />
            <path
              d="M50 70 L53 55 L50 50 L47 55 Z"
              fill="#A0AEC0"
              stroke="#718096"
              strokeWidth="1.5"
            />

            <circle cx="50" cy="50" r="3" fill="#6B46C1" />
          </svg>
          <span className="font-extrabold">Bible Nav</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-7 h-7"
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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/books"
            className="text-gray-800 hover:text-blue-700 transition-colors text-base font-medium"
          >
            Books
          </Link>
          {isAuthenticated && (
            <Link
              href="/favorites"
              className="text-gray-800 hover:text-blue-700 transition-colors text-base font-medium"
            >
              Favorites
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-gray-800 text-base font-semibold">
                Hello, {user?.username || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-base shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium text-base shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu (conditionally rendered) */}
      {isOpen && (
        <div className="md:hidden bg-blue-100 rounded-b-lg shadow-inner py-3">
          <div className="flex flex-col items-center space-y-3">
            <Link
              href="/books"
              onClick={() => setIsOpen(false)}
              className="text-gray-800 hover:text-blue-700 transition-colors text-base font-medium w-full text-center py-1.5"
            >
              Books
            </Link>
            {isAuthenticated && (
              <Link
                href="/favorites"
                onClick={() => setIsOpen(false)}
                className="text-gray-800 hover:text-blue-700 transition-colors text-base font-medium w-full text-center py-1.5"
              >
                Favorites
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <span className="text-gray-800 text-base font-semibold w-full text-center py-1.5">
                  Hello, {user?.username || "User"}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-base w-auto shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium text-base w-auto shadow-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base w-auto shadow-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

// src/components/Navbar.tsx
// This component provides the global navigation bar for the application.

"use client"; // This component uses client-side hooks like useRouter and Zustand

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore"; // Import the Zustand auth store

const Navbar: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position

  // Function to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled down more than 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    clearAuth(); // Clear authentication state
    router.push("/login"); // Redirect to login page after logout
    setIsOpen(false); // Close mobile menu on logout
  };

  return (
    // Outer header: Fixed at the top, full width, with a subtle background and shadow for the fixed area.
    // This creates the "sticky" effect.
    // Conditional classes for height/shadow based on scroll
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-gray-50 bg-opacity-90 backdrop-blur-sm transition-all duration-300
      ${isScrolled ? "py-0.5 shadow-lg" : "py-1 shadow-md"}`}
    >
      {" "}
      {/* Reduced overall header padding */}
      {/* Inner nav: Contains the "floating card" appearance, centered within the fixed header.
          Added vertical margin to create space around the floating card.
          Adjusted padding for responsiveness for a significantly smaller bar. */}
      <nav
        className={`max-w-7xl mx-auto rounded-xl border border-blue-200 flex items-center justify-between transition-all duration-300
        ${
          isScrolled
            ? "my-0.5 p-1 sm:p-1.5 lg:p-2 bg-blue-100"
            : "my-1 p-2 sm:p-2.5 lg:p-3 bg-blue-50"
        }`}
      >
        {" "}
        {/* Reduced padding and margin */}
        {/* Logo/Brand */}
        <Link
          href="/"
          className={`font-extrabold text-blue-800 hover:text-blue-900 transition-colors flex-shrink-0
          ${isScrolled ? "text-xl" : "text-2xl"}`}
        >
          {" "}
          {/* Shrink logo size on scroll */}
          Bible Nav
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
              {" "}
              {/* Slightly smaller icon */}
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
          {" "}
          {/* Reduced space-x */}
          {/* Removed Home link as logo handles routing to home */}
          <Link
            href="/books"
            className="text-gray-800 hover:text-blue-700 transition-colors text-base font-medium"
          >
            Books
          </Link>{" "}
          {/* Reduced text size */}
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
              </span>{" "}
              {/* Reduced text size */}
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
                {" "}
                {/* Reduced button padding */}
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base shadow-md"
              >
                {" "}
                {/* Reduced button padding */}
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Mobile Menu (conditionally rendered) */}
      {isOpen && (
        <div className="md:hidden bg-blue-100 rounded-b-lg shadow-inner py-3">
          {" "}
          {/* Reduced mobile menu padding */}
          <div className="flex flex-col items-center space-y-3">
            {" "}
            {/* Reduced space-y */}
            {/* Removed Home link */}
            <Link
              href="/books"
              onClick={() => setIsOpen(false)}
              className="text-gray-800 hover:text-blue-700 transition-colors text-base font-medium w-full text-center py-1.5"
            >
              Books
            </Link>{" "}
            {/* Reduced text size and padding */}
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
                </span>{" "}
                {/* Reduced text size and padding */}
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
                  {" "}
                  {/* Reduced button padding */}
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base w-auto shadow-md"
                >
                  {" "}
                  {/* Reduced button padding */}
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

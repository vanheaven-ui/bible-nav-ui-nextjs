"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import * as api from "@/lib/backendApi";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Eye, EyeOff } from "lucide-react";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Call the custom backend API to create the user
      const signupResponse = await api.signupUser(username, email, password);
      console.log("Signup successful, user created:", signupResponse);

      // Step 2: Once the user is created in the database,
      // call NextAuth's signIn function to handle the session.
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        // NextAuth's session provider will automatically update the session.
        // The useEffect hook will then handle the redirection.
        console.log("NextAuth signIn successful.");
      } else {
        // This handles an edge case where signup succeeds but signIn fails
        setError(
          result?.error || "Login failed after signup. Please try logging in."
        );
      }
    } catch (err: unknown) {
      console.error("Signup failed:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: unknown) {
      console.error("Google Sign-Up failed:", err);
      setError("Google Sign-Up failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[#f9f5e7]/80 -z-10"></div>
      <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-[#d4af37]/20 blur-[120px] -z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#a4161a]/20 blur-[150px] -z-0"></div>

      <div className="relative z-10 max-w-4xl w-full px-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#6b705c]/20 flex flex-col md:flex-row overflow-hidden">
        {/* Signup Form */}
        <div className="flex-1 p-6 md:border-r border-[#6b705c]/20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#6b705c] mb-6 text-center md:text-left">
            Create your account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#495057] mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="block w-full rounded-xl px-4 py-3 border border-[#6b705c]/30 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#495057] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-xl px-4 py-3 border border-[#6b705c]/30 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
              />
            </div>

            {/* Password input with show/hide functionality */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#495057] mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full rounded-xl px-4 py-3 border border-[#6b705c]/30 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm pr-12"
              />
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-[#6b705c] hover:text-[#495057] focus:outline-none"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password input with show/hide functionality */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#495057] mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="block w-full rounded-xl px-4 py-3 border border-[#6b705c]/30 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm pr-12"
              />
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-[#6b705c] hover:text-[#495057] focus:outline-none"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {error && (
              <div className="text-[#a4161a] text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-[#a4161a] hover:bg-[#822121] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-sm text-center md:text-left mt-4 text-[#495057]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#a4161a] hover:text-[#822121]"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Google Sign Up */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[#f9f5e7]/50">
          <h2 className="text-xl md:text-2xl font-bold text-[#495057] mb-6 text-center">
            Or sign up with Google
          </h2>
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-[#d4af37] hover:bg-[#c89f2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a4161a] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Google Icon */}
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 533.5 544.3"
            >
              <path
                d="M533.5 278.4c0-18.3-1.5-36-4.3-53.2H272v100.7h146.9c-6.3 33.7-25.2 62.3-53.9 81.3v67h87.1c50.9-46.9 80.4-116.2 80.4-195.8z"
                fill="#4285f4"
              />
              <path
                d="M272 544.3c72.6 0 133.5-24.1 178-65.4l-87.1-67c-24.2 16.3-55.1 25.9-90.9 25.9-69.9 0-129.3-47.2-150.6-110.4H31.2v69.2C75.5 487.5 168 544.3 272 544.3z"
                fill="#34a853"
              />
              <path
                d="M121.4 319.9c-10.3-30.6-10.3-63.8 0-94.4V156.3H31.2c-38.3 76.7-38.3 168.1 0 244.8l90.2-69.2z"
                fill="#fbbc04"
              />
              <path
                d="M272 107.6c37.8-.6 73.3 13.1 100.6 37.7l75.4-75.4C405.1 24.1 344.2 0 272 0 168 0 75.5 56.8 31.2 156.3l90.2 69.2C142.7 154.8 202.1 107.6 272 107.6z"
                fill="#ea4335"
              />
            </svg>
            {googleLoading ? "Signing up..." : "Sign up with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

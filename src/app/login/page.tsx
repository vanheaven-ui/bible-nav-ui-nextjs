"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "../../lib/backendApi";
import { useAuthStore } from "../../store/authStore";
import { Loader2 } from "lucide-react"; // spinner icon

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      setAuth(data.token, data.user);
      router.push("/");
    } catch (err: unknown) {
      console.error("Login failed:", err);
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred during login.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parchment and glow */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/images/parchment-bg.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-[#f9f5e7]/80 -z-10"></div>
      <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-[#d4af37]/20 blur-[120px] -z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#a4161a]/20 blur-[150px] -z-0"></div>

      {/* Card */}
      <div className="relative z-10 max-w-md w-full p-10 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#6b705c]/20">
        <h2 className="text-center text-3xl font-extrabold text-[#6b705c]">
          Log in to your account
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#495057] mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-xl px-4 py-3 border border-[#6b705c]/30 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#495057] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-xl px-4 py-3 border border-[#6b705c]/30 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-[#a4161a] text-sm text-center mt-2">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-[#a4161a] hover:bg-[#822121] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>

        {/* Signup link */}
        <div className="text-sm text-center mt-6 text-[#495057]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#a4161a] hover:text-[#822121]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

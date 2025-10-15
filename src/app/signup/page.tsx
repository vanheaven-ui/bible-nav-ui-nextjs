"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import * as api from "@/lib/backendApi";
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

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("🙏 Please fill in all required fields to continue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(
        "📜 That doesn’t look like a valid email. Please check and try again."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "💪 Password must be at least 6 characters long — build a strong foundation."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("🤝 Passwords do not match. Please ensure both are identical.");
      return;
    }

    setLoading(true);

    try {
      await api.signupUser(username, email, password);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(
          "⚠️ Something went wrong during login. Please try logging in manually."
        );
        return;
      }

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Unique constraint")) {
          setError(
            "🕊 This email or username already exists. Perhaps try logging in?"
          );
        } else if (err.message.toLowerCase().includes("network")) {
          setError(
            "🌐 Connection issue — please check your internet and try again."
          );
        } else {
          setError(
            `⚠️ ${
              err.message || "An unexpected issue occurred. Please try again."
            }`
          );
        }
      } else {
        setError("⚠️ Something unexpected happened. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError(
        "🙏 We couldn’t connect to Google right now. Please try again later."
      );
      setGoogleLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#a4161a]" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/80" />
      <div className="absolute left-1/3 top-1/4 h-[30vw] w-[30vw] rounded-full bg-[#d4af37]/20 blur-[120px] -z-0" />
      <div className="absolute bottom-1/4 right-1/3 h-[35vw] w-[35vw] rounded-full bg-[#a4161a]/20 blur-[150px] -z-0" />

      {/* Card */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#6b705c]/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl md:flex-row">
        {/* Credentials Signup */}
        <div className="flex-1 p-6 md:border-r md:border-[#6b705c]/20">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-[#6b705c] md:text-left md:text-3xl">
            Create your account
          </h2>

          <form className="space-y-4" onSubmit={handleSignupSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#495057]">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="focus:ring-[#d4af37] sm:text-sm block w-full rounded-xl border border-[#6b705c]/30 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#d4af37] focus:ring-2"
                disabled={loading || googleLoading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#495057]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="focus:ring-[#d4af37] sm:text-sm block w-full rounded-xl border border-[#6b705c]/30 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#d4af37] focus:ring-2"
                disabled={loading || googleLoading}
              />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-[#495057]">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="focus:ring-[#d4af37] sm:text-sm block w-full rounded-xl border border-[#6b705c]/30 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#d4af37] focus:ring-2"
                disabled={loading || googleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-[#6b705c] outline-none hover:text-[#495057]"
                disabled={loading || googleLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-[#495057]">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="focus:ring-[#d4af37] sm:text-sm block w-full rounded-xl border border-[#6b705c]/30 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#d4af37] focus:ring-2"
                disabled={loading || googleLoading}
              />
            </div>

            {error && (
              <div className="text-center rounded-md border border-[#a4161a]/20 bg-[#fceaea]/80 p-3 text-sm text-[#7a1c1c] shadow-inner transition-all">
                <p className="font-medium italic leading-snug">
                  <span className="block text-[#a4161a] font-semibold">
                    ⚔️ Take heart!
                  </span>
                  {error}
                  <span className="block mt-1 text-xs text-[#6b705c]">
                    “The righteous fall seven times and rise again.” — Proverbs
                    24:16
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a4161a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#822121] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#495057] md:text-left">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#a4161a] hover:text-[#822121]"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Google Signup */}
        <div className="flex flex-1 flex-col items-center justify-center bg-[#f9f5e7]/50 p-6">
          <h2 className="mb-6 text-center text-xl font-bold text-[#495057] md:text-2xl">
            Or sign up with Google
          </h2>
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c89f2e] focus:outline-none focus:ring-2 focus:ring-[#a4161a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Signing up...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
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
                Sign up with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

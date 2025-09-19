"use client"

import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);

  // State to handle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // This function simulates a login API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      // In a real app, you would check credentials here
      setSignedIn(true);
    }, 1500);
  };

  // This function simulates a Google sign-in flow
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    setTimeout(() => {
      setGoogleLoading(false);
      setSignedIn(true);
    }, 1500);
  };

  if (signedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            Log-in Successful!
          </h2>
          <p className="mt-4 text-gray-600">
            You are now logged in. This is a placeholder for your home page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/f9f5e7/544331?text=Background')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/80"></div>
      <div className="absolute left-1/3 top-1/4 h-[30vw] w-[30vw] rounded-full bg-[#d4af37]/20 blur-[120px] -z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 h-[35vw] w-[35vw] rounded-full bg-[#a4161a]/20 blur-[150px] -z-0"></div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#6b705c]/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl md:flex-row">
        {/* Login Form Section */}
        <div className="flex-1 p-6 md:border-r md:border-[#6b705c]/20">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-[#6b705c] md:text-left md:text-3xl">
            Log in to your account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                className="focus:ring-[#d4af37]sm:text-sm block w-full rounded-xl border border-[#6b705c]/30 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#d4af37] focus:ring-2"
              />
            </div>

            {/* Password input with show/hide functionality */}
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
                className="focus:ring-[#d4af37]sm:text-sm block w-full rounded-xl border border-[#6b705c]/30 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#d4af37] focus:ring-2"
              />
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-[#6b705c] outline-none hover:text-[#495057]"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-eye-off"
                  >
                    <path d="M10.585 10.585A2 2 0 0 0 12 11a2 2 0 0 0 2-2m-4.24-4.24L10 5.8m4.24 4.24l.7-.7a1 1 0 0 0-1.42-1.42L13.58 8.16M6.61 6.61A9.79 9.79 0 0 1 12 5c4.76 0 8.76 3.06 10 7-1.17 3.39-4.29 6-10 6-1.58 0-3.08-.43-4.47-1.2l-.8-.8M2 2l20 20" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-eye"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <div className="text-center text-sm text-[#a4161a]">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a4161a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#822121] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#495057] md:text-left">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("This would navigate to the signup page.");
              }}
              className="font-semibold text-[#a4161a] hover:text-[#822121]"
            >
              Sign up
            </a>
          </div>
        </div>

        {/* Google Sign In Section */}
        <div className="flex flex-1 flex-col items-center justify-center bg-[#f9f5e7]/50 p-6">
          <h2 className="mb-6 text-center text-xl font-bold text-[#495057] md:text-2xl">
            Or sign in with Google
          </h2>
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c89f2e] focus:outline-none focus:ring-2 focus:ring-[#a4161a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Google Icon */}
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
            {googleLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

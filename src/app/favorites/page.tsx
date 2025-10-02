"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { getFavoriteVerses, deleteFavoriteVerse } from "../../lib/backendApi";
import Link from "next/link";
import { XCircle, Loader2 } from "lucide-react";

interface FavoriteVerse {
  id: number;
  user_id?: number;
  book: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  createdAt: Date; // Assuming Date object, as per your interface definition
}

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const FavoritesPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch favorite verses
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFavoriteVerses();
        // NOTE: If response.verses returns dates as strings (ISO 8601),
        // you may need to map them to Date objects here for strict TypeScript compliance:
        // setFavoriteVerses(response.verses.map(v => ({...v, createdAt: new Date(v.createdAt)})));
        setFavoriteVerses(response.verses);
      } catch (err: unknown) {
        console.error("Failed to fetch favorite verses:", err);
        setError("Failed to load favorite verses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Handle deleting a favorite verse
  const handleDelete = async (verseId: number) => {
    setDeleteLoadingId(verseId);
    setError(null);
    try {
      await deleteFavoriteVerse(verseId);
      setFavoriteVerses((prev) => prev.filter((v) => v.id !== verseId));
    } catch (err: unknown) {
      console.error("Failed to delete favorite verse:", err);
      setError("Failed to delete favorite verse. Please try again.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Navigate to ChapterVersesPage and scroll to selected verse
  const handleVerseClick = (verse: FavoriteVerse) => {
    router.push(
      `/books/${encodeURIComponent(verse.book)}/${verse.chapter}?verse=${
        verse.verseNumber
      }`
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-[#2d2a26]">
      {/* Background Image and Overlay */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85" />

      {/* Sacred Glow */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-[#d4af37]/25 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#a4161a]/25 blur-[150px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 sm:px-10 lg:px-16 py-20 items-start">
        {/* Left side: Heading */}
        <header className="text-left space-y-6 lg:sticky lg:top-20">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#6b705c] leading-tight">
            Treasured <span className="text-[#a4161a]">Verses</span>
          </h1>
          <p className="text-lg sm:text-xl font-light text-[#495057] max-w-lg">
            A collection of scriptures you have marked as a source of
            inspiration and guidance.
          </p>
        </header>

        {/* Right side: Verse List */}
        <section
          className="relative w-full p-8 sm:p-10 rounded-3xl shadow-2xl space-y-8
                         bg-gradient-to-br from-[#f9f5e7]/50 to-[#f9f5e7]/30 backdrop-blur-md border border-[#6b705c]/20
                         max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 size={48} className="animate-spin text-[#d4af37]" />
              <p className="mt-4 text-center text-[#495057] text-lg font-semibold">
                Loading your cherished verses...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-12 text-[#a4161a]">
              <XCircle size={48} />
              <p className="text-lg font-semibold">{error}</p>
            </div>
          ) : favoriteVerses.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-12">
              <h2 className="text-3xl font-bold text-[#6b705c]">
                Your Sacred Collection Awaits
              </h2>
              <p className="text-[#495057] max-w-sm">
                Start your journey through the scriptures and save verses you
                love. They will appear here.
              </p>
              <Link
                href="/books"
                className="mt-4 px-8 py-4 bg-[#a4161a] text-white font-semibold rounded-full shadow-lg hover:bg-[#822121] transition-all transform hover:scale-105"
              >
                Explore Books 📖
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {favoriteVerses.map((verse) => (
                <div
                  key={verse.id}
                  // UPDATED CLASSES for unique clickable indicator
                  className="relative p-6 bg-[#f9f5e7]/80 rounded-2xl shadow-lg border border-[#6b705c]/20 flex flex-col justify-between 
                             transition-all duration-300 cursor-pointer 
                             group hover:shadow-xl hover:border-[#d4af37] hover:bg-[#f9f5e7] hover:scale-[1.02]"
                  onClick={() => handleVerseClick(verse)}
                >
                  {/* UNIQUE INDICATOR: The "Sacred Annotation" Dashed Border */}
                  <div
                    className="absolute inset-0 rounded-2xl border-4 border-dashed border-transparent 
                               group-hover:border-[#d4af37]/70 transition-all duration-500 ease-out 
                               pointer-events-none"
                  />

                  <div>
                    <p className="text-[#6b705c] font-bold text-xl">
                      {verse.book} {verse.chapter}:{verse.verseNumber}
                    </p>
                    <p className="mt-2 text-[#495057] italic leading-relaxed">
                      &quot;{verse.verseText}&quot;
                    </p>
                    <p className="mt-4 text-[#d4af37] text-sm font-semibold">
                      <span className="mr-2">Saved:</span>
                      {new Date(verse.createdAt).toLocaleDateString(
                        "en-US",
                        dateOptions
                      )}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(verse.id);
                    }}
                    disabled={deleteLoadingId === verse.id}
                    className="mt-6 px-4 py-2 bg-[#a4161a] text-white rounded-full hover:bg-[#822121] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {deleteLoadingId === verse.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FavoritesPage;

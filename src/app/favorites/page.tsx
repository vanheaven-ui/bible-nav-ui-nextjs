"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { getFavoriteVerses, deleteFavoriteVerse } from "../../lib/backendApi";
import Link from "next/link"; // Import Link component

interface FavoriteVerse {
  id: number;
  user_id: number;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
  created_at: string;
}

const FavoritesPage: React.FC = () => {
  const { token, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push("/login");
    }
  }, [isAuthenticated, token, router]);

  // Fetch favorite verses
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getFavoriteVerses(token);
        setFavoriteVerses(response.verses);
      } catch (err: unknown) {
        console.error("Failed to fetch favorite verses:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load favorite verses.");
        } else {
          setError("An unknown error occurred while loading favorites.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]); // Re-fetch when token changes

  const handleDelete = async (verseId: number) => {
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }

    setDeleteLoadingId(verseId);
    setError(null);
    try {
      await deleteFavoriteVerse(token, verseId);
      // Optimistically update the UI
      setFavoriteVerses((prevVerses) =>
        prevVerses.filter((verse) => verse.id !== verseId)
      );
    } catch (err: unknown) {
      console.error("Failed to delete favorite verse:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to delete favorite verse.");
      } else {
        setError("An unknown error occurred while deleting the verse.");
      }
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (!isAuthenticated && !loading) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          Your Favorite Verses
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">
            Loading your favorite verses...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : favoriteVerses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 p-8">
            <h2 className="text-2xl font-bold text-gray-700">
              Your favorites list is empty.
            </h2>
            <p className="text-gray-600 max-w-sm">
              Start your journey through the scriptures and add verses to your
              favorites.
            </p>
            <Link
              href="/books"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Start Exploring! 📖
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {favoriteVerses.map((verse) => (
              <div
                key={verse.id}
                className="p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <p className="text-lg font-semibold text-blue-700">
                    {verse.book} {verse.chapter}:{verse.verse_number}
                  </p>
                  <p className="text-gray-800 italic mt-2 leading-relaxed">
                    &quot;{verse.verse_text}&quot;
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Added on: {new Date(verse.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(verse.id)}
                  disabled={deleteLoadingId === verse.id}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoadingId === verse.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

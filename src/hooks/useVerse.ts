import { useEffect, useState, useCallback } from "react";
import {
  fetchVerseOfTheDay,
  VerseDetails,
  VerseOfTheDay,
} from "@/lib/bibleApi";
import { useVerseStore } from "@/store/verseStore";

const useVerse = () => {
  const [verseData, setVerseData] = useState<VerseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setLastUpdated, clearNewVerse } = useVerseStore();

  // FIX 1: State variable to manually trigger a re-fetch
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // FIX 2: Memoized function to increment the trigger state
  const refreshVerse = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getVerse = async () => {
      setLoading(true);
      setError(null);

      console.log("Fetching Verse of the Day (Trigger:", fetchTrigger, ")");

      try {
        // We ensure we pass a new AbortSignal for the current fetch
        const data: VerseOfTheDay | null = await fetchVerseOfTheDay({ signal });

        if (data?.verse?.details) {
          setVerseData(data.verse.details);
          // Only update last updated if fetch was successful (and it's the main daily fetch)
          if (fetchTrigger === 0) {
            const today = new Date().toISOString().split("T")[0];
            setLastUpdated(today);
          }
        } else {
          setVerseData(null);
          setError("Failed to load Verse of the Day. Please try again later.");
        }
      } catch (e: unknown) {
        if ((e as any)?.name === "AbortError") {
          // Request was aborted, do nothing
          console.log("Fetch aborted");
        } else {
          setVerseData(null);
          setError("An error occurred while fetching the verse.");
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    getVerse();

    // Clear new verse notification only on the initial load (fetchTrigger === 0)
    // Subsequent manual refreshes should not clear notifications unless intended.
    if (fetchTrigger === 0) {
      clearNewVerse();
    }

    // Cleanup: abort fetch if component unmounts
    return () => {
      controller.abort();
    };

    // FIX 3: Add fetchTrigger to dependency array to re-run useEffect when refreshVerse is called
  }, [setLastUpdated, clearNewVerse, fetchTrigger]);

  return { verseData, loading, error, refreshVerse };
};

export default useVerse;

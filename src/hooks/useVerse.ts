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

  const [fetchTrigger, setFetchTrigger] = useState(0);

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
        const data: VerseOfTheDay | null = await fetchVerseOfTheDay({ signal });

        if (data?.verse?.details) {
          setVerseData(data.verse.details);

          if (fetchTrigger === 0) {
            const today = new Date().toISOString().split("T")[0];
            setLastUpdated(today);
          }
        } else {
          setVerseData(null);
          setError("Failed to load Verse of the Day. Please try again later.");
        }
      } catch (e: unknown) {
        // Type-safe narrowing
        if (
          e &&
          typeof e === "object" &&
          "name" in e &&
          (e as { name?: string }).name === "AbortError"
        ) {
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

    if (fetchTrigger === 0) {
      clearNewVerse();
    }

    return () => {
      controller.abort();
    };
  }, [setLastUpdated, clearNewVerse, fetchTrigger]);

  return { verseData, loading, error, refreshVerse };
};

export default useVerse;

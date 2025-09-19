import { useEffect, useState } from "react";
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

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getVerse = async () => {
      setLoading(true);
      setError(null);

      try {
        const data: VerseOfTheDay | null = await fetchVerseOfTheDay({ signal });

        if (data?.verse?.details) {
          setVerseData(data.verse.details);
          const today = new Date().toISOString().split("T")[0];
          setLastUpdated(today);
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
    clearNewVerse();

    // Cleanup: abort fetch if component unmounts
    return () => {
      controller.abort();
    };
  }, [setLastUpdated, clearNewVerse]);

  return { verseData, loading, error };
};

export default useVerse;

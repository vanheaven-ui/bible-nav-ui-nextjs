import {
  fetchVerseOfTheDay,
  VerseDetails,
  VerseOfTheDay,
} from "@/lib/bibleApi";
import { useVerseStore } from "@/store/verseStore";
import { useEffect, useState } from "react";

const useVerse = () => {
  const [verseData, setVerseData] = useState<VerseDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setLastUpdated, clearNewVerse } = useVerseStore();

  useEffect(() => {
    const getVerse = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: VerseOfTheDay | null = await fetchVerseOfTheDay();

        if (data && data.verse && data.verse.details) {
          setVerseData(data.verse.details);
          const today = new Date().toISOString().split("T")[0];
          setLastUpdated(today);
        } else {
          setVerseData(null);
          setError("Failed to load Verse of the Day. Please try again later.");
        }
      } catch (e: unknown) {
        setVerseData(null);
        setError("An error occurred while fetching the verse.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    getVerse();
    clearNewVerse();
  }, [setLastUpdated, clearNewVerse]);

  return { verseData, loading, error };
};

export default useVerse;

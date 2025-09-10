const VERSE_OF_THE_DAY_API_URL =
  "https://beta.ourmanna.com/api/v1/get?format=json&order=daily";
const BIBLE_API_BASE_URL = "https://bible-api.com/";
const BIBLE_SUPERSEARCH_API_BASE_URL = "https://api.biblesupersearch.com/api/";

// ---------- Interfaces ----------
export interface VerseOfTheDay {
  verse: {
    details: {
      text: string;
      reference: string;
      version: string;
    };
  };
}

export interface BibleVerse {
  text: string;
  reference: string;
  translation_name: string;
}

export interface Verse {
  verse_number: number;
  text: string;
}

export interface FavoriteVerse {
  id: number;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
}

export interface SuperSearchBibleBook {
  id: number;
  name: string;
  shortname: string;
  chapters: number;
  chapter_verses: Record<string, number>;
}

export interface ChapterVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  chapter: number;
  verses: ChapterVerse[];
}

export interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Interfaces for API responses to resolve `any` types
interface BibleApiVerseResponse {
  text: string;
  verses: {
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
  translation_name: string;
}

interface SuperSearchBooksApiResponse {
  results: {
    id: number;
    name: string;
    shortname: string;
    chapters: number;
    chapter_verses: Record<string, number>;
  }[];
}

interface BibleApiChapterResponse {
  verses: {
    chapter: number;
    verse: number;
    text: string;
  }[];
}

// New interface for the backup API response
interface SuperSearchChapterApiResponse {
  results: {
    verses: {
      verse_id: string;
      verse: number;
      text: string;
      chapter_id: string;
    }[];
  };
}

interface BibleApiSearchResponse {
  verses: {
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
}

export interface VerseDetails {
  text: string;
  reference: string;
  version: string;
}

// ---------- Cache with expiration ----------
interface CacheItem<T> {
  data: T;
  expiry: number; // timestamp in ms
}

const cache = new Map<string, CacheItem<unknown>>();

/**
 * Fetch JSON with optional cache and expiration
 * @param url - API URL
 * @param ttl - time-to-live in milliseconds (default: 12 hours)
 */
async function fetchJson<T>(
  url: string,
  ttl = 12 * 60 * 60 * 1000
): Promise<T | null> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Fetch error: ${response.status} ${response.statusText}`);
      throw new Error("Failed to fetch data.");
    }
    const data = (await response.json()) as T;

    // Save to cache with expiry
    cache.set(url, { data, expiry: now + ttl });
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
}

// ---------- Static Book Name Mapping ----------
const bookShortNames: Record<string, string> = {
  Genesis: "Gen",
  Exodus: "Exo",
  Leviticus: "Lev",
  Numbers: "Num",
  Deuteronomy: "Deu",
  Joshua: "Jos",
  Judges: "Jdg",
  Ruth: "Rth",
  "1 Samuel": "1Sa",
  "2 Samuel": "2Sa",
  "1 Kings": "1Ki",
  "2 Kings": "2Ki",
  "1 Chronicles": "1Ch",
  "2 Chronicles": "2Ch",
  Ezra: "Ezr",
  Nehemiah: "Neh",
  Esther: "Est",
  Job: "Job",
  Psalms: "Psa",
  Proverbs: "Pro",
  Ecclesiastes: "Ecc",
  "Song of Solomon": "SoS",
  Isaiah: "Isa",
  Jeremiah: "Jer",
  Lamentations: "Lam",
  Ezekiel: "Eze",
  Daniel: "Dan",
  Hosea: "Hos",
  Joel: "Joe",
  Amos: "Amo",
  Obadiah: "Oba",
  Jonah: "Jon",
  Micah: "Mic",
  Nahum: "Nah",
  Habakkuk: "Hab",
  Zephaniah: "Zep",
  Haggai: "Hag",
  Zechariah: "Zec",
  Malachi: "Mal",
  Matthew: "Mat",
  Mark: "Mar",
  Luke: "Luk",
  John: "Joh",
  Acts: "Act",
  Romans: "Rom",
  "1 Corinthians": "1Co",
  "2 Corinthians": "2Co",
  Galatians: "Gal",
  Ephesians: "Eph",
  Philippians: "Php",
  Colossians: "Col",
  "1 Thessalonians": "1Th",
  "2 Thessalonians": "2Th",
  "1 Timothy": "1Ti",
  "2 Timothy": "2Ti",
  Titus: "Tit",
  Philemon: "Phm",
  Hebrews: "Heb",
  James: "Jam",
  "1 Peter": "1Pe",
  "2 Peter": "2Pe",
  "1 John": "1Jo",
  "2 John": "2Jo",
  "3 John": "3Jo",
  Jude: "Jud",
  Revelation: "Rev",
};

// ---------- API Functions ----------

export async function fetchVerseOfTheDay(): Promise<VerseOfTheDay | null> {
  return await fetchJson<VerseOfTheDay>(VERSE_OF_THE_DAY_API_URL);
}

export async function fetchBibleVerse(
  reference: string,
  version: string = "web"
): Promise<BibleVerse | null> {
  const encodedReference = encodeURIComponent(reference);
  const url = `${BIBLE_API_BASE_URL}${encodedReference}?translation=${version}`;
  const data = await fetchJson<BibleApiVerseResponse>(url);

  if (data?.verses && data.verses.length > 0) {
    const verseData = data.verses[0];
    return {
      text: verseData.text,
      reference: `${verseData.book_name} ${verseData.chapter}:${verseData.verse}`,
      translation_name: data.translation_name,
    };
  }
  return null;
}

export async function fetchBibleBooks(
  language: string = "en"
): Promise<SuperSearchBibleBook[]> {
  const url = `${BIBLE_SUPERSEARCH_API_BASE_URL}books?language=${language}`;
  const data = await fetchJson<SuperSearchBooksApiResponse>(url);

  if (data?.results && data.results.length > 0) {
    return data.results
      .filter((b) => typeof b === "object" && b !== null && "id" in b)
      .map((book) => ({
        id: book.id,
        name: book.name,
        shortname: book.shortname,
        chapters: book.chapters,
        chapter_verses: book.chapter_verses,
      }));
  }

  return [];
}

export async function fetchBibleChapter(
  book: string,
  chapter: number,
  version: string = "web"
): Promise<BibleChapter | null> {
  const encodedBook = encodeURIComponent(book);

  // 1. Try Primary API (bible-api.com)
  try {
    const primaryUrl = `${BIBLE_API_BASE_URL}${encodedBook}+${chapter}?translation=${version}`;
    const data = await fetchJson<BibleApiChapterResponse>(primaryUrl);

    if (data?.verses && data.verses.length > 0) {
      return {
        chapter: chapter,
        verses: data.verses.map((v) => ({
          verse: v.verse,
          text: v.text,
        })),
      };
    }
  } catch (primaryError) {
    console.warn("Primary API failed, trying backup API...", primaryError);
  }

  // 2. Try Backup API (biblesupersearch.com) using static mapping
  try {
    const shortBookName = bookShortNames[book];
    if (!shortBookName) {
      throw new Error(`Could not find short name for book: ${book}`);
    }

    const encodedShortName = encodeURIComponent(shortBookName);
    const backupUrl = `${BIBLE_SUPERSEARCH_API_BASE_URL}verses?bible=web&book_name=${encodedShortName}&chapter=${chapter}`;
    const data = await fetchJson<SuperSearchChapterApiResponse>(backupUrl);

    if (data?.results?.verses && data.results.verses.length > 0) {
      return {
        chapter: chapter,
        verses: data.results.verses.map((v) => ({
          verse: v.verse,
          text: v.text,
        })),
      };
    }
  } catch (backupError) {
    console.error("Both primary and backup APIs failed.", backupError);
  }

  return null;
}

/**
 * SEARCH: Fixed to use bible-api.com to avoid 404
 */
export async function searchBibleVerses(
  query: string,
  version: string = "kjv"
): Promise<SearchResult[]> {
  const encodedQuery = encodeURIComponent(query);
  const url = `${BIBLE_API_BASE_URL}${encodedQuery}?translation=${version}`;
  const data = await fetchJson<BibleApiSearchResponse>(url);

  if (data?.verses && data.verses.length > 0) {
    return data.verses.map((v) => ({
      book: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
    }));
  }

  return [];
}

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

// ---------- Cache with expiration ----------
interface CacheItem<T> {
  data: T;
  expiry: number; // timestamp in ms
}

const cache = new Map<string, CacheItem<any>>();

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
      return null;
    }
    const data = (await response.json()) as T;

    // Save to cache with expiry
    cache.set(url, { data, expiry: now + ttl });
    return data;
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

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
  const data = await fetchJson<any>(url);

  if (data?.verses?.length > 0) {
    return {
      text: data.verses[0].text,
      reference: `${data.verses[0].book_name} ${data.verses[0].chapter}:${data.verses[0].verse}`,
      translation_name: data.translation_name,
    };
  }
  return null;
}

export async function fetchBibleBooks(
  language: string = "en"
): Promise<SuperSearchBibleBook[]> {
  const url = `${BIBLE_SUPERSEARCH_API_BASE_URL}books?language=${language}`;
  const data = await fetchJson<any>(url);

  if (data?.results?.length > 0) {
    return data.results
      .filter((b: any) => typeof b === "object" && b !== null && "id" in b)
      .map((book: any) => ({
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
  const url = `${BIBLE_API_BASE_URL}${encodedBook}+${chapter}?translation=${version}`;
  const data = await fetchJson<any>(url);

  if (data?.verses?.length > 0) {
    return {
      chapter: data.verses[0].chapter,
      verses: data.verses.map((v: { verse: number; text: string }) => ({
        verse: v.verse,
        text: v.text,
      })),
    };
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
  const data = await fetchJson<any>(url);

  if (data?.verses?.length > 0) {
    return data.verses.map((v: any) => ({
      book: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
    }));
  }

  return [];
}

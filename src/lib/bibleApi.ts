// backendApi.ts
const VERSE_OF_THE_DAY_API_URL =
  "https://beta.ourmanna.com/api/v1/get?format=json&order=daily";
const BIBLE_API_BASE_URL = "https://bible-api.com/";
const BIBLE_SUPERSEARCH_API_BASE_URL = "https://api.biblesupersearch.com/api/";

// ---------- Interfaces ----------
export interface VerseOfTheDay {
  verse: { details: VerseDetails };
}

export interface VerseDetails {
  text: string;
  reference: string;
  version: string;
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
  id: number | string;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
}

export interface SuperSearchBibleBook {
  id: number | string;
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

// ---------- API Response Interfaces ----------
interface BibleApiVerseResponse {
  verses: { book_name: string; chapter: number; verse: number; text: string }[];
  translation_name: string;
}

interface BibleApiSearchResponse {
  verses: { book_name: string; chapter: number; verse: number; text: string }[];
}

interface SuperSearchResponse {
  results: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
}

interface SuperSearchBooksApiResponse {
  results: {
    id: number | string;
    name: string;
    shortname: string;
    chapters: number;
    chapter_verses: Record<string, number>;
  }[];
}

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

// ---------- Cache with Expiration ----------
interface CacheItem<T> {
  data: T;
  expiry: number;
}
const cache = new Map<string, CacheItem<unknown>>();

// ---------- Fetch Helper ----------
async function fetchJson<T>(
  url: string,
  ttl = 12 * 60 * 60 * 1000,
  signal?: AbortSignal
): Promise<T | null> {
  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.expiry > now) return cached.data as T;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok)
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    const data = (await response.json()) as T;
    cache.set(url, { data, expiry: now + ttl });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// ---------- Static Book Short Names ----------
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

// Verse of the Day
export async function fetchVerseOfTheDay(): Promise<VerseOfTheDay | null> {
  return fetchJson<VerseOfTheDay>(VERSE_OF_THE_DAY_API_URL);
}

// Fetch Bible Verse by reference
export async function fetchBibleVerse(
  reference: string,
  version = "web"
): Promise<BibleVerse | null> {
  const data = await fetchJson<BibleApiVerseResponse>(
    `${BIBLE_API_BASE_URL}${encodeURIComponent(reference)}?translation=${version}`
  );
  if (!data?.verses?.length) return null;

  const v = data.verses[0];
  return {
    text: v.text,
    reference: `${v.book_name} ${v.chapter}:${v.verse}`,
    translation_name: data.translation_name,
  };
}

// Fetch All Books
export async function fetchBibleBooks(
  language = "en"
): Promise<SuperSearchBibleBook[]> {
  const data = await fetchJson<SuperSearchBooksApiResponse>(
    `${BIBLE_SUPERSEARCH_API_BASE_URL}books?language=${language}`
  );
  return (
    data?.results?.map((b) => ({
      id: b.id,
      name: b.name,
      shortname: b.shortname,
      chapters: b.chapters,
      chapter_verses: b.chapter_verses,
    })) ?? []
  );
}

// Fetch Chapter
export async function fetchBibleChapter(
  book: string,
  chapter: number,
  version = "web"
): Promise<BibleChapter | null> {
  const encodedBook = encodeURIComponent(book);
  const primaryData = await fetchJson<BibleApiVerseResponse>(
    `${BIBLE_API_BASE_URL}${encodedBook}+${chapter}?translation=${version}`
  );

  if (primaryData?.verses?.length) {
    return {
      chapter,
      verses: primaryData.verses.map((v) => ({ verse: v.verse, text: v.text })),
    };
  }

  // fallback to SuperSearch
  const shortBook = bookShortNames[book];
  const backupData = await fetchJson<SuperSearchChapterApiResponse>(
    `${BIBLE_SUPERSEARCH_API_BASE_URL}verses?bible=${version}&book_name=${shortBook}&chapter=${chapter}`
  );
  if (backupData?.results?.verses?.length) {
    return {
      chapter,
      verses: backupData.results.verses.map((v) => ({
        verse: v.verse,
        text: v.text,
      })),
    };
  }

  return null;
}

// 🔍 Enhanced Keyword + Reference Search
export async function searchBibleVerses(
  query: string,
  version = "kjv"
): Promise<SearchResult[]> {
  const trimmed = query.trim();

  // Detect reference (e.g., "John 3:16" or "Psalm 23")
  const refPattern = /^[1-3]?\s?[A-Za-z]+\s?\d+(:\d+)?$/;
  const isReference = refPattern.test(trimmed);

  if (isReference) {
    // Bible-API handles direct references best
    const data = await fetchJson<BibleApiSearchResponse>(
      `${BIBLE_API_BASE_URL}${encodeURIComponent(trimmed)}?translation=${version}`
    );
    return (
      data?.verses?.map((v) => ({
        book: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })) ?? []
    );
  } else {
    // Perform keyword search using BibleSuperSearch
    const keywordUrl = `${BIBLE_SUPERSEARCH_API_BASE_URL}search?bible=${version}&query=${encodeURIComponent(
      trimmed
    )}`;
    const data = await fetchJson<SuperSearchResponse>(keywordUrl);

    // Fallback to Bible API search (sometimes more generous)
    if (!data?.results?.length) {
      const fallback = await fetchJson<BibleApiSearchResponse>(
        `${BIBLE_API_BASE_URL}${encodeURIComponent(trimmed)}?translation=${version}`
      );
      return (
        fallback?.verses?.map((v) => ({
          book: v.book_name,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text,
        })) ?? []
      );
    }

    return data.results.map((v) => ({
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
    }));
  }
}

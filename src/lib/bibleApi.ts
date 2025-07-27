// src/lib/bibleApi.ts
// This file contains utility functions for interacting with external Bible APIs.

const VERSE_OF_THE_DAY_API_URL =
  "https://beta.ourmanna.com/api/v1/get?format=json&order=daily";
const BIBLE_API_BASE_URL = "https://bible-api.com/"; // For individual verses and chapters
const BIBLE_SUPERSEARCH_API_BASE_URL = "https://api.biblesupersearch.com/api/"; // For listing books

interface VerseOfTheDay {
  verse: {
    details: {
      text: string;
      reference: string;
      version: string;
    };
  };
}

interface BibleVerse {
  text: string;
  reference: string;
  translation_name: string;
}

// Interface for a book object from Bible SuperSearch API
interface SuperSearchBibleBook {
  book_id: string;
  book_name: string;
  chapters: number;
  testament: string;
  // ... other properties you might get but aren't strictly needed for just the name
}

// Interface for a single verse object within a chapter response
interface ChapterVerse {
  verse: number;
  text: string;
}

interface BibleChapter {
  chapter: number;
  verses: ChapterVerse[]; // Use the new ChapterVerse interface
}

/**
 * Fetches the Verse of the Day from the OurManna API.
 * @returns A promise that resolves to the VerseOfTheDay object or null if an error occurs.
 */
export async function fetchVerseOfTheDay(): Promise<VerseOfTheDay | null> {
  try {
    const response = await fetch(VERSE_OF_THE_DAY_API_URL);
    if (!response.ok) {
      console.error(`Error fetching Verse of the Day: ${response.statusText}`);
      return null;
    }
    const data: VerseOfTheDay = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Verse of the Day:", error);
    return null;
  }
}

/**
 * Fetches a specific verse from bible-api.com.
 * @param reference - The verse reference (e.g., "John 3:16").
 * @param version - The Bible version (e.g., "kjv", "web"). Defaults to "web".
 * @returns A promise that resolves to the BibleVerse object or null.
 */
export async function fetchBibleVerse(
  reference: string,
  version: string = "web"
): Promise<BibleVerse | null> {
  try {
    const encodedReference = encodeURIComponent(reference);
    const url = `${BIBLE_API_BASE_URL}${encodedReference}?translation=${version}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching verse ${reference}: ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    // The bible-api.com response structure is a bit nested for verses
    if (data.verses && data.verses.length > 0) {
      return {
        text: data.verses[0].text,
        reference:
          data.verses[0].book_name +
          " " +
          data.verses[0].chapter +
          ":" +
          data.verses[0].verse,
        translation_name: data.translation_name,
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch verse ${reference}:`, error);
    return null;
  }
}

/**
 * Fetches a list of all books from Bible SuperSearch API.
 * @param language - The 2-character ISO 639-1 language code (e.g., "en"). Defaults to "en".
 * @returns A promise that resolves to an array of book names.
 */
export async function fetchBibleBooks(
  language: string = "en"
): Promise<string[]> {
  try {
    const url = `${BIBLE_SUPERSEARCH_API_BASE_URL}books?language=${language}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching Bible books: ${response.statusText}`);
      return [];
    }
    const data: { books: SuperSearchBibleBook[] } = await response.json();
    if (data.books) {
      return data.books.map((book) => book.book_name);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch Bible books:", error);
    return [];
  }
}

/**
 * Fetches a specific chapter from bible-api.com.
 * @param book - The book name (e.g., "John").
 * @param chapter - The chapter number (e.g., 3).
 * @param version - The Bible version (e.g., "kjv", "web"). Defaults to "web".
 * @returns A promise that resolves to the BibleChapter object or null.
 */
export async function fetchBibleChapter(
  book: string,
  chapter: number,
  version: string = "web"
): Promise<BibleChapter | null> {
  try {
    const encodedBook = encodeURIComponent(book);
    const url = `${BIBLE_API_BASE_URL}${encodedBook}+${chapter}?translation=${version}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching chapter ${book} ${chapter}: ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    if (data.verses && data.verses.length > 0) {
      return {
        chapter: data.verses[0].chapter, // Assuming all verses in response are from the same chapter
        verses: data.verses.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text,
        })), // Explicitly typed 'v'
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch chapter ${book} ${chapter}:`, error);
    return null;
  }
}

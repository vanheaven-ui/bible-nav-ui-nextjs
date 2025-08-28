const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api";

interface ErrorResponse {
  message: string;
}

// A single verse
export interface Verse {
  verse_number: number;
  text: string;
}

// A chapter with verses
export interface Chapter {
  chapter: number;
  verses: Verse[];
}

// A whole book
export interface BibleBook {
  id: number;
  name: string;
  chapters: number;
}

// Favorite verse type (kept same as before)
export interface FavoriteVerse {
  id: number;
  user_id: number;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
  created_at: string;
}

// User type for login
export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

// Login response type
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Base API request helper
 */
async function makeBackendApiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body:
      body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (err: unknown) {
    console.error(`Error making request to ${endpoint}:`, err);
    if (err instanceof Error) throw err;
    throw new Error("An unknown error occurred during API request.");
  }
}

//
// ---------- 🔹 Authentication API Functions ----------
//

/**
 * Logs a user in and returns a token and user details.
 * @param email - The user's email.
 * @param password - The user's password.
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return makeBackendApiRequest<LoginResponse>(
    "/auth/login",
    "POST",
    { email, password }
  );
}

//
// ---------- 🔹 Bible API Functions ----------
//

/**
 * Fetch all Bible books (name + chapters).
 */
export async function fetchBibleBooks(): Promise<BibleBook[]> {
  return makeBackendApiRequest<BibleBook[]>("/bible/books");
}

/**
 * Fetch all verses of a given book + chapter.
 * @param bookName - Name of the book, e.g. "Genesis"
 * @param chapter - Chapter number
 */
export async function fetchChapterVerses(
  bookName: string,
  chapter: number
): Promise<Verse[]> {
  return makeBackendApiRequest<Verse[]>(
    `/bible/books/${encodeURIComponent(bookName)}/chapters/${chapter}`
  );
}

// ---------- 🔹 Favorite Verses API  ----------

export async function addFavoriteVerse(
  token: string,
  verseDetails: Omit<FavoriteVerse, "id" | "user_id" | "created_at">
): Promise<{ message: string; verse: FavoriteVerse }> {
  return makeBackendApiRequest<{ message: string; verse: FavoriteVerse }>(
    "/verses/favorites",
    "POST",
    verseDetails,
    token
  );
}

export async function getFavoriteVerses(
  token: string
): Promise<{ message: string; verses: FavoriteVerse[] }> {
  return makeBackendApiRequest<{ message: string; verses: FavoriteVerse[] }>(
    "/verses/favorites",
    "GET",
    undefined,
    token
  );
}

export async function deleteFavoriteVerse(
  token: string,
  verseId: number
): Promise<{ message: string }> {
  return makeBackendApiRequest<{ message: string }>(
    `/verses/favorites/${verseId}`,
    "DELETE",
    undefined,
    token
  );
}

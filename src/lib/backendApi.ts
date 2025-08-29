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

// Favorite verse type
export interface FavoriteVerse {
  id: number;
  user_id: number;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
  created_at: string;
}

// Note type
export interface Note {
  id: number;
  user_id: number;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
}

// User type for login and signup
export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
}

// Login and Signup response type
export interface AuthResponse {
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

    // Read response as text first
    const text = await response.text();

    // Try to parse as JSON
    let data: T | ErrorResponse;
    try {
      data = JSON.parse(text);
    } catch {
      console.error(`Non-JSON response from ${endpoint}:`, text);
      throw new Error(
        `Expected JSON but received non-JSON response from ${endpoint}`
      );
    }

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return data as T;
  } catch (err: unknown) {
    console.error(`Error making request to ${endpoint}:`, err);
    if (err instanceof Error) throw err;
    throw new Error("An unknown error occurred during API request.");
  }
}

//
// ---------- 🔹 Authentication API Functions ----------
//

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return makeBackendApiRequest<AuthResponse>("/auth/login", "POST", {
    email,
    password,
  });
}

export async function signupUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return makeBackendApiRequest<AuthResponse>("/auth/signup", "POST", {
    username,
    email,
    password,
  });
}

//
// ---------- 🔹 Bible API Functions ----------
//

export async function fetchBibleBooks(): Promise<BibleBook[]> {
  return makeBackendApiRequest<BibleBook[]>("/bible/books");
}

export async function fetchChapterVerses(
  bookName: string,
  chapter: number
): Promise<Verse[]> {
  // Use encodeURIComponent once, do not double-encode
  return makeBackendApiRequest<Verse[]>(
    `/bible/books/${encodeURIComponent(bookName)}/chapters/${chapter}`
  );
}

//
// ---------- 🔹 Favorite Verses API ----------
//

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

//
// ---------- 🔹 Notes API Functions ----------
//

export async function addNote(
  token: string,
  noteDetails: Omit<Note, "id" | "user_id" | "created_at">
): Promise<Note> {
  return makeBackendApiRequest<Note>("/notes", "POST", noteDetails, token);
}

export async function getNotes(
  token: string,
  filters?: { book?: string; chapter?: number; verse?: number }
): Promise<Note[]> {
  const query = new URLSearchParams();
  if (filters?.book) query.append("book", filters.book);
  if (filters?.chapter) query.append("chapter", filters.chapter.toString());
  if (filters?.verse) query.append("verse", filters.verse.toString());

  const endpoint = `/notes${query.toString() ? `?${query.toString()}` : ""}`;
  return makeBackendApiRequest<Note[]>(endpoint, "GET", undefined, token);
}

export async function deleteNote(
  token: string,
  noteId: number
): Promise<{ message: string }> {
  return makeBackendApiRequest<{ message: string }>(
    `/notes/${noteId}`,
    "DELETE",
    undefined,
    token
  );
}

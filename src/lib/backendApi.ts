import { Session } from "next-auth";

// -------------------- Interfaces --------------------

export interface User {
  id: string;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  password?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  user: User;
}

export interface ErrorResponse {
  message: string;
}

export interface FavoriteVerse {
  id: number;
  userId?: string;
  book: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  createdAt: Date;
}

export interface Note {
  id: number;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

// -------------------- Helper Functions --------------------

function parseDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(parseDates) as unknown as T;
  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const key in obj as object) {
      const value = (obj as Record<string, unknown>)[key];
      if (
        typeof value === "string" &&
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z/.test(value)
      ) {
        result[key] = new Date(value);
      } else {
        result[key] = parseDates(value);
      }
    }
    return result as T;
  }
  return obj;
}

export async function makeLocalApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const isBrowser = typeof window !== "undefined";

  const config: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    ...(isBrowser && { credentials: "include" as RequestCredentials }),
  };

  const response = await fetch(endpoint, config);
  const text = await response.text();

  if (!response.ok) {
    try {
      const errorData: { error?: string } = JSON.parse(text);
      throw new Error(errorData.error || `API Error: ${response.status}`);
    } catch {
      throw new Error(text || `API Error: ${response.status}`);
    }
  }

  try {
    const json = JSON.parse(text);
    return parseDates(json) as T;
  } catch {
    throw new Error(`Expected JSON but received non-JSON response: ${text}`);
  }
}

// -------------------- Auth --------------------

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return makeLocalApiRequest<AuthResponse>("/api/auth", "POST", {
    email,
    password,
  });
}

export async function signupUser(
  username: string,
  email: string,
  password: string
): Promise<SignupResponse> {
  return makeLocalApiRequest<SignupResponse>("/api/signup", "POST", {
    username,
    email,
    password,
  });
}

// -------------------- Favorites --------------------

export async function getFavoriteVerses(): Promise<{
  verses: FavoriteVerse[];
}> {
  return makeLocalApiRequest<{ verses: FavoriteVerse[] }>("/api/favorites");
}

export async function addFavoriteVerse(
  verseDetails: Omit<FavoriteVerse, "id" | "userId" | "createdAt">
): Promise<FavoriteVerse> {
  return makeLocalApiRequest<FavoriteVerse>(
    "/api/favorites",
    "POST",
    verseDetails
  );
}

export async function deleteFavoriteVerse(
  verseId: number
): Promise<{ message: string }> {
  return makeLocalApiRequest<{ message: string }>(
    `/api/favorites/${verseId}`,
    "DELETE"
  );
}

// -------------------- Notes --------------------

export async function getNotes(filters?: {
  book?: string;
  chapter?: number;
  verse?: number;
}): Promise<{ notes: Note[] }> {
  const query = new URLSearchParams();
  if (filters?.book) query.append("book", filters.book);
  if (filters?.chapter !== undefined)
    query.append("chapter", filters.chapter.toString());
  if (filters?.verse !== undefined)
    query.append("verse", filters.verse.toString());

  const endpoint = `/api/notes${
    query.toString() ? `?${query.toString()}` : ""
  }`;
  const notesArray = await makeLocalApiRequest<{ notes: Note[] }>(endpoint);

  return notesArray;
}

export async function addNote(
  noteDetails: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Note> {
  return makeLocalApiRequest<Note>("/api/notes", "POST", noteDetails);
}

export async function deleteNote(noteId: number): Promise<{ message: string }> {
  return makeLocalApiRequest<{ message: string }>(
    `/api/notes/${noteId}`,
    "DELETE"
  );
}

// -------------------- AI --------------------

export async function askAI(prompt: string): Promise<{ answer: string }> {
  return makeLocalApiRequest<{ answer: string }>("/api/ai", "POST", { prompt });
}

const BACKEND_API_BASE_URL = "/api";

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
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to recursively convert ISO strings to Date
function parseDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(parseDates) as unknown as T;
  } else if (typeof obj === "object") {
    const result: any = {};
    for (const key in obj) {
      const value = (obj as any)[key];
      if (
        typeof value === "string" &&
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z/.test(value)
      ) {
        result[key] = new Date(value);
      } else {
        result[key] = parseDates(value);
      }
    }
    return result;
  }
  return obj;
}

async function makeLocalApiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(endpoint, config);
  const text = await response.text();

  if (!response.ok) {
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.error || `API Error: ${response.status}`);
    } catch {
      throw new Error(text || `API Error: ${response.status}`);
    }
  }

  try {
    const json = JSON.parse(text);
    return parseDates(json) as T; // Convert date strings to Date
  } catch {
    throw new Error(`Expected JSON but received non-JSON response: ${text}`);
  }
}

// ----------------- API FUNCTIONS -----------------

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

export async function addFavoriteVerse(
  verseDetails: Omit<FavoriteVerse, "id" | "userId" | "createdAt">
): Promise<FavoriteVerse> {
  return makeLocalApiRequest<FavoriteVerse>(
    "/api/favorites",
    "POST",
    verseDetails
  );
}

export async function getFavoriteVerses(): Promise<{
  verses: FavoriteVerse[];
}> {
  return makeLocalApiRequest<{ verses: FavoriteVerse[] }>(
    "/api/favorites",
    "GET"
  );
}

export async function deleteFavoriteVerse(
  verseId: string
): Promise<{ message: string }> {
  return makeLocalApiRequest<{ message: string }>(
    `/api/favorites/${verseId}`,
    "DELETE"
  );
}

export async function addNote(
  noteDetails: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Note> {
  return makeLocalApiRequest<Note>("/api/notes", "POST", noteDetails);
}

export async function getNotes(filters?: {
  book?: string;
  chapter?: number;
  verse?: number;
}): Promise<Note[]> {
  const query = new URLSearchParams();
  if (filters?.book) query.append("book", filters.book);
  if (filters?.chapter !== undefined)
    query.append("chapter", filters.chapter.toString());
  if (filters?.verse !== undefined)
    query.append("verse", filters.verse.toString());

  const endpoint = `/api/notes${
    query.toString() ? `?${query.toString()}` : ""
  }`;
  return makeLocalApiRequest<Note[]>(endpoint, "GET");
}

export async function deleteNote(noteId: string): Promise<{ message: string }> {
  return makeLocalApiRequest<{ message: string }>(
    `/api/notes/${noteId}`,
    "DELETE"
  );
}

export async function askAI(prompt: string): Promise<{ answer: string }> {
  return makeLocalApiRequest<{ answer: string }>("/api/ai", "POST", { prompt });
}

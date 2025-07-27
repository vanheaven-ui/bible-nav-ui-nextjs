// src/lib/backendApi.ts
// This file contains utility functions for interacting with your Node.js/Express backend API.

// Replace with your deployed Render API URL or local development URL
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000/api";

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at?: string;
  };
}

interface ErrorResponse {
  message: string;
}

/**
 * Helper function to make authenticated API requests.
 * @param endpoint - The API endpoint (e.g., "/auth/login", "/verses/favorites").
 * @param method - HTTP method (e.g., "GET", "POST", "DELETE").
 * @param body - Request body for POST/PUT requests. Changed from 'any' to 'unknown' for type safety.
 * @param token - Optional JWT token for authenticated requests.
 * @returns A promise that resolves to the JSON response.
 */
export async function makeBackendApiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown, // Changed from any to unknown
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
    // Safely stringify body: check if it's not null/undefined before stringifying
    body: (body !== undefined && body !== null) ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}${endpoint}`, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    // Return JSON for successful responses
    return response.json();
  } catch (err: unknown) { // Changed 'any' to 'unknown'
    console.error(`Error making request to ${endpoint}:`, err);
    if (err instanceof Error) {
      throw err; // Re-throw the error if it's an Error instance
    } else {
      throw new Error("An unknown error occurred during API request.");
    }
  }
}

/**
 * Calls the signup endpoint of the backend API.
 * @param username - User's username.
 * @param email - User's email.
 * @param password - User's password.
 * @returns A promise that resolves to the AuthResponse.
 */
export async function signupUser(username: string, email: string, password: string): Promise<AuthResponse> {
  return makeBackendApiRequest<AuthResponse>("/auth/signup", "POST", { username, email, password });
}

/**
 * Calls the login endpoint of the backend API.
 * @param email - User's email.
 * @param password - User's password.
 * @returns A promise that resolves to the AuthResponse.
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return makeBackendApiRequest<AuthResponse>("/auth/login", "POST", { email, password });
}

// You will add more functions here for favorite verses later (add, get, delete)

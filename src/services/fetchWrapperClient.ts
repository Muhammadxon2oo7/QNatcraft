"use client";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export interface ErrorData {
  error?: { message?: string };
  message?: string;
}

type FetchWrapperClient = <T>(url: string, options?: FetchOptions) => Promise<T>;

const fetchWrapperClient: FetchWrapperClient = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Cookie’dan tokenni olish
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.endsWith("/")
    ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/`;

  const response = await fetch(`${baseUrl}${url.startsWith("/") ? url.slice(1) : url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Cookie’lar bilan birga yuborish uchun
  });

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}.`;

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = (await response.json()) as ErrorData;
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } else {
        errorMessage = await response.text();
      }
    } catch (e) {
      errorMessage = `Failed to parse error response. Status: ${response.status}.`;
    }

    if (response.status === 401) {
      window.location.href = "/login";
    }

    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    throw new Error("Unexpected response format from the server.");
  }
};

export default fetchWrapperClient;
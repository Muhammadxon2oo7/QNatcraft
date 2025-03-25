// src/services/fetchWrapperClient.ts
// "use server" olib tashlandi, client-side uchun moslashtirildi

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export interface ErrorData {
  error?: {
    message?: string;
  };
  message?: string;
}

const fetchWrapperClient = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const BASE_URL = "https://qqrnatcraft.uz"; // To'g'ri backend URL

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Tokenni cookie'dan olish (client-side)
  const token = document.cookie.match(/accessToken=([^;]+)/)?.[1];
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/${url.startsWith("/") ? url.slice(1) : url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
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
      window.location.href = "/login"; // Client-side redirect
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


;
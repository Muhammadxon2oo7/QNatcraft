interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export interface ErrorData {
  error?: {
    message?: string;
  };
  message?: string;
  [key: string]: any;
}

const fetchWrapperClient = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const BASE_URL = "https://qqrnatcraft.uz";

  const defaultHeaders: HeadersInit = {};
  // Agar body FormData bo‘lmasa, Content-Type qo‘shiladi
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

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
    let errorDetails = {};

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = (await response.json()) as ErrorData;
        errorMessage = errorData.error?.message || errorData.message || JSON.stringify(errorData);
        errorDetails = errorData;
      } else {
        errorMessage = await response.text();
      }
    } catch (e) {
      errorMessage = `Failed to parse error response. Status: ${response.status}.`;
    }

    console.error("Server xato xabari:", { errorMessage, errorDetails });

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
interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
  }
  
  export interface ErrorData {
    error?: {
      message?: string;
    };
    message?: string;
  }
  
  const getTokenFromCookie = (key: string): string | null => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [cookieKey, value] = cookie.split("=");
      if (cookieKey === key) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };
  
  type FetchWrapper = <T>(url: string, options?: FetchOptions) => Promise<T>;
  
  const fetchWrapper: FetchWrapper = async <T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };
  
    // Tokenni cookie'dan olish
    const token = getTokenFromCookie("accessToken") || getTokenFromCookie("token"); // "accessToken" yoki "token" dan birini sinab ko'ring
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  
    const baseUrl = process.env.BACKEND_BASE_URL?.endsWith("/")
    ? process.env.BACKEND_BASE_URL
    : `${process.env.BACKEND_BASE_URL}/`;
  
    const response = await fetch(`${baseUrl}${url.startsWith("/") ? url.slice(1) : url}`, {
      ...options,
      credentials: "include", // Cookie'larni serverga yuborish uchun
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
  
  export default fetchWrapper;
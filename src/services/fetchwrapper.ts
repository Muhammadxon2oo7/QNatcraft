"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export interface ErrorData {
  error?: {
    message?: string;
  };
  message?: string; 
}

type FetchWrapper = <T>(
  url: string,
  options?: FetchOptions,
  revalidate?: string
) => Promise<T>;

const fetchWrapper: FetchWrapper = async <T>(
  url: string,
  options: FetchOptions = {},
  revalidate?: string
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Retrieve token from cookies
  const token = (await cookies()).get("token")?.value;
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = process.env.BACKEND_BASE_URL?.endsWith("/")
  ? process.env.BACKEND_BASE_URL
  : `${process.env.BACKEND_BASE_URL}/`;

const response = await fetch(`${baseUrl}${url.startsWith("/") ? url.slice(1) : url}`, {
  ...options,
  headers: {
    ...defaultHeaders,
    ...options.headers,
  },
});


  const contentType = response.headers.get("content-type");

  // Handle errors
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
      redirect("/login");
    }

    throw new Error(errorMessage);
  }

  if (revalidate) {
    revalidateTag(revalidate);
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    throw new Error("Unexpected response format from the server.");
  }
};

export default fetchWrapper;

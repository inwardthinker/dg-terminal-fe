import { env } from "@/lib/constants/env";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const isAbsoluteUrl = /^https?:\/\//i.test(path);
  if (!isAbsoluteUrl && !env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const { body, headers, ...rest } = options;
  const baseUrl = env.apiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const requestUrl = isAbsoluteUrl ? path : `${baseUrl}${normalizedPath}`;
  const requestHeaders: HeadersInit = body
    ? {
        "Content-Type": "application/json",
        ...headers,
      }
    : {
        ...headers,
      };

  const response = await fetch(requestUrl, {
    ...rest,
    credentials: "include",
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      isJson && typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: string }).message ?? "Request failed.")
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

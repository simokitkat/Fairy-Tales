import type { ApiError } from "@fairy-tales/shared";

export const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export class ApiClientError extends Error {
  readonly status: number;
  readonly userMessage: string;
  readonly raw: unknown;

  constructor(status: number, userMessage: string, raw: unknown) {
    super(userMessage);
    this.name = "ApiClientError";
    this.status = status;
    this.userMessage = userMessage;
    this.raw = raw;
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  signal?: AbortSignal
): Promise<T> {
  const url = `${API_BASE}${path}`;
  let response: Response;
  try {
    response = await fetch(url, { ...options, signal });
  } catch (e) {
    throw new ApiClientError(0, "Network error", e);
  }

  if (!response.ok) {
    let apiError: { error?: string; userMessage?: string } = { error: `HTTP ${response.status}` };
    try {
      const parsed = (await response.json()) as ApiError;
      apiError = parsed as { error?: string; userMessage?: string };
    } catch {
      apiError = { error: `HTTP ${response.status}` };
    }
    throw new ApiClientError(
      response.status,
      apiError.userMessage ?? apiError.error ?? `HTTP ${response.status}`,
      apiError
    );
  }

  return response.json() as Promise<T>;
}

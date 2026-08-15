import type { TaleCard, TaleDetail, TaleListResponse } from "@/lib/types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getTales({
  language,
  availableIn,
  limit = 20,
  offset = 0,
}: {
  language?: string;
  availableIn?: string[];
  limit?: number;
  offset?: number;
}): Promise<TaleListResponse> {
  const params = new URLSearchParams();
  if (language) params.set("language", language);
  if (availableIn && availableIn.length > 0) {
    availableIn.forEach((lang) => params.append("availableIn", lang));
  }
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const res = await fetch(`${API_BASE}/fairy-tales?${params.toString()}`);
  return handleResponse<TaleListResponse>(res);
}

export async function getTale(slug: string): Promise<TaleDetail> {
  const res = await fetch(`${API_BASE}/fairy-tales/${encodeURIComponent(slug)}`);
  if (res.status === 404) {
    throw new Error("Not found");
  }
  return handleResponse<TaleDetail>(res);
}

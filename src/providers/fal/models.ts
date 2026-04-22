import "server-only";
import type { ModelInfo } from "@/providers/types";

const PLATFORM_API = "https://api.fal.ai/v1/models";
const IMAGE_CATEGORY = "text-to-image";
const CACHE_TTL_SECONDS = 60 * 60;
const PAGE_LIMIT = 100;
const MAX_PAGES = 20;

type FalModelEntry = {
  endpoint_id: string;
  metadata?: {
    display_name?: string;
    description?: string;
    category?: string;
    tags?: string[];
    status?: string;
  };
};

type FalModelResponse = {
  models: FalModelEntry[];
  next_cursor: string | null;
  has_more: boolean;
};

/**
 * Lists active image-generation models from fal's Platform API.
 * Results are cached via Next.js fetch Data Cache for CACHE_TTL_SECONDS.
 */
export async function fetchFalImageModels(): Promise<ModelInfo[]> {
  const apiKey = process.env.FAL_KEY;
  const headers: HeadersInit = {};
  if (apiKey) headers.Authorization = `Key ${apiKey}`;

  const collected: ModelInfo[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(PLATFORM_API);
    url.searchParams.set("category", IMAGE_CATEGORY);
    url.searchParams.set("status", "active");
    url.searchParams.set("limit", String(PAGE_LIMIT));
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, {
      headers,
      next: { revalidate: CACHE_TTL_SECONDS },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `fal Platform API ${res.status} ${res.statusText}${body ? `: ${body}` : ""}`,
      );
    }
    const data = (await res.json()) as FalModelResponse;

    for (const entry of data.models) {
      collected.push({
        id: entry.endpoint_id,
        name: entry.metadata?.display_name ?? entry.endpoint_id,
        description: entry.metadata?.description,
        mediaType: "image",
        providerId: "fal",
        tags: entry.metadata?.tags,
      });
    }

    if (!data.has_more || !data.next_cursor) break;
    cursor = data.next_cursor;
  }

  return collected;
}

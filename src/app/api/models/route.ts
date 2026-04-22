import { NextResponse } from "next/server";
import { getAllProviders } from "@/providers/registry";
import type { MediaType } from "@/lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mediaType = (url.searchParams.get("mediaType") ?? "image") as MediaType;

  const providers = getAllProviders();
  const all = await Promise.all(providers.map((p) => p.listModels(mediaType)));
  return NextResponse.json({ models: all.flat() });
}

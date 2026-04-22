import { NextResponse } from "next/server";
import { getProvider } from "@/providers/registry";
import {
  createSession,
  insertOutput,
  updateOutputResult,
  getSession,
} from "@/db/queries";
import { shortId } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenerateRequest = {
  prompt: string;
  seed?: number;
  selections: Array<{ providerId: string; modelId: string }>;
};

export async function POST(request: Request) {
  let body: GenerateRequest;
  try {
    body = (await request.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }
  if (!Array.isArray(body.selections) || body.selections.length < 2) {
    return NextResponse.json(
      { error: "Pick at least two models to compare." },
      { status: 400 },
    );
  }

  const sessionId = shortId();
  const createdAt = new Date().toISOString();
  createSession({
    id: sessionId,
    prompt: body.prompt.trim(),
    seed: body.seed ?? null,
    createdAt,
  });

  const outputIds: string[] = [];
  for (const sel of body.selections) {
    const outputId = shortId();
    outputIds.push(outputId);
    insertOutput({
      id: outputId,
      sessionId,
      providerId: sel.providerId,
      modelId: sel.modelId,
      status: "pending",
      createdAt,
    });
  }

  await Promise.all(
    body.selections.map(async (sel, index) => {
      const outputId = outputIds[index];
      try {
        const provider = getProvider(sel.providerId);
        const result = await provider.generateImage(sel.modelId, {
          prompt: body.prompt,
          seed: body.seed,
        });
        const first = result.images[0];
        updateOutputResult(outputId, {
          status: "success",
          url: first.url,
          width: first.width,
          height: first.height,
          seed: result.seed,
          latencyMs: result.latencyMs,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        updateOutputResult(outputId, {
          status: "error",
          error: message,
        });
      }
    }),
  );

  const session = getSession(sessionId);
  return NextResponse.json({ session });
}

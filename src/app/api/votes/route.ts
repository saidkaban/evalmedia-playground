import { NextResponse } from "next/server";
import { insertVote, getSession } from "@/db/queries";
import { shortId } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoteRequest = {
  sessionId: string;
  winnerOutputId: string;
};

export async function POST(request: Request) {
  let body: VoteRequest;
  try {
    body = (await request.json()) as VoteRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.sessionId || !body.winnerOutputId) {
    return NextResponse.json(
      { error: "sessionId and winnerOutputId are required." },
      { status: 400 },
    );
  }

  const session = getSession(body.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }
  const valid = session.outputs.some((o) => o.id === body.winnerOutputId);
  if (!valid) {
    return NextResponse.json(
      { error: "winnerOutputId does not belong to this session." },
      { status: 400 },
    );
  }

  insertVote({
    id: shortId(),
    sessionId: body.sessionId,
    winnerOutputId: body.winnerOutputId,
    createdAt: new Date().toISOString(),
  });

  const updated = getSession(body.sessionId);
  return NextResponse.json({ session: updated });
}

import { NextResponse } from "next/server";
import { listSessions, getModelVoteTallies } from "@/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sessions = listSessions(100);
  const tallies = getModelVoteTallies();
  return NextResponse.json({ sessions, tallies });
}

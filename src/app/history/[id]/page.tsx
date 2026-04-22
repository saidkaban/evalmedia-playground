import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/db/queries";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getSession(id);
  if (!session) notFound();

  const winnerId = session.votes[session.votes.length - 1]?.winnerOutputId;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6">
      <Link href="/history" className="text-xs text-muted hover:text-foreground">
        ← back to history
      </Link>
      <div className="mt-3 mb-5">
        <div className="mb-1 text-xs text-muted">
          {formatRelativeTime(session.createdAt)}
          {session.seed != null && ` · seed ${session.seed}`}
        </div>
        <h1 className="text-base">{session.prompt}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {session.outputs.map((o) => (
          <figure
            key={o.id}
            className="overflow-hidden rounded-md border border-border bg-surface"
          >
            {o.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={o.url} alt={o.modelId} className="w-full" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-xs text-danger">
                {o.error ?? o.status}
              </div>
            )}
            <figcaption className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs">
              <span className="truncate font-mono">{o.modelId}</span>
              <span className="flex items-center gap-2 text-muted">
                {o.latencyMs != null && <span>{(o.latencyMs / 1000).toFixed(1)}s</span>}
                {o.id === winnerId && <span className="text-accent">winner</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

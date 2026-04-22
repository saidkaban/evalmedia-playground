import Link from "next/link";
import { listSessions, getModelVoteTallies } from "@/db/queries";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const sessions = listSessions(100);
  const tallies = getModelVoteTallies().sort((a, b) => b.wins - a.wins);
  const totalVotes = tallies.reduce((sum, t) => sum + t.wins, 0);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="mb-4 text-lg font-medium">History</h1>
          {sessions.length === 0 ? (
            <div className="rounded-md border border-border bg-surface p-8 text-center text-sm text-muted">
              No comparisons yet. Run one from the home page.
            </div>
          ) : (
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/history/${s.id}`}
                    className="block rounded-md border border-border bg-surface p-4 hover:bg-surface-hover"
                  >
                    <div className="mb-2 flex items-center justify-between gap-4 text-xs text-muted">
                      <span>{formatRelativeTime(s.createdAt)}</span>
                      <span className="font-mono">{s.id}</span>
                    </div>
                    <div className="mb-2 line-clamp-2 text-sm">{s.prompt}</div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>{s.outputs.length} models</span>
                      {s.seed != null && <span>seed {s.seed}</span>}
                      {s.votes.length > 0 && <span>{s.votes.length} votes</span>}
                      <span className="ml-auto flex gap-1">
                        {s.outputs.slice(0, 4).map((o) =>
                          o.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={o.id}
                              src={o.url}
                              alt=""
                              className="h-10 w-10 rounded border border-border object-cover"
                            />
                          ) : (
                            <span
                              key={o.id}
                              className="inline-block h-10 w-10 rounded border border-border bg-background"
                            />
                          ),
                        )}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside>
          <h2 className="mb-2 text-sm font-medium">Aggregate votes</h2>
          <p className="mb-3 text-xs text-muted">
            Total votes cast: {totalVotes}
          </p>
          {tallies.length === 0 ? (
            <div className="rounded-md border border-border bg-surface p-4 text-xs text-muted">
              Use blind A/B mode to start voting.
            </div>
          ) : (
            <ul className="space-y-1.5">
              {tallies.map((t) => {
                const pct = totalVotes === 0 ? 0 : (t.wins / totalVotes) * 100;
                return (
                  <li
                    key={`${t.providerId}:${t.modelId}`}
                    className="rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="truncate font-mono">{t.modelId}</span>
                      <span className="text-muted">{t.wins}</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded bg-background">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

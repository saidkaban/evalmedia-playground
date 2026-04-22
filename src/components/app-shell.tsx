"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("evalmedia-theme", theme);
    } catch {}
  }, [theme]);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              <span>evalmedia playground</span>
            </Link>
            <nav className="hidden items-center gap-1 text-sm md:flex">
              <NavLink href="/" active={pathname === "/"}>
                <Sparkles size={14} />
                Compare
              </NavLink>
              <NavLink href="/history" active={pathname?.startsWith("/history")}>
                <History size={14} />
                History
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/saidkaban/evalmedia-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs text-muted hover:text-foreground md:inline"
            >
              GitHub
            </a>
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:bg-surface-hover hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean | undefined;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted hover:bg-surface-hover hover:text-foreground",
        active && "bg-surface-hover text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

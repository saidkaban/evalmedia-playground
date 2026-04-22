"use client";

import { create } from "zustand";
import type { ModelInfo } from "@/providers/types";
import type { SessionRow } from "@/lib/types";

type PlaygroundState = {
  models: ModelInfo[];
  loadingModels: boolean;
  selectedKeys: string[];
  prompt: string;
  seed: number | null;
  blindMode: boolean;
  generating: boolean;
  session: SessionRow | null;
  error: string | null;

  setModels: (m: ModelInfo[]) => void;
  setLoadingModels: (v: boolean) => void;
  toggleModel: (key: string) => void;
  setPrompt: (v: string) => void;
  setSeed: (v: number | null) => void;
  setBlindMode: (v: boolean) => void;
  setGenerating: (v: boolean) => void;
  setSession: (s: SessionRow | null) => void;
  setError: (e: string | null) => void;
  reset: () => void;
};

export function modelKey(m: Pick<ModelInfo, "providerId" | "id">) {
  return `${m.providerId}:${m.id}`;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  models: [],
  loadingModels: true,
  selectedKeys: [],
  prompt: "",
  seed: null,
  blindMode: false,
  generating: false,
  session: null,
  error: null,

  setModels: (models) => set({ models }),
  setLoadingModels: (loadingModels) => set({ loadingModels }),
  toggleModel: (key) =>
    set((s) => {
      const has = s.selectedKeys.includes(key);
      return {
        selectedKeys: has
          ? s.selectedKeys.filter((k) => k !== key)
          : [...s.selectedKeys, key],
      };
    }),
  setPrompt: (prompt) => set({ prompt }),
  setSeed: (seed) => set({ seed }),
  setBlindMode: (blindMode) => set({ blindMode }),
  setGenerating: (generating) => set({ generating }),
  setSession: (session) => set({ session }),
  setError: (error) => set({ error }),
  reset: () => set({ session: null, error: null }),
}));

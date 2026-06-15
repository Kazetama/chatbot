"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Flame, X, Award, CheckCircle2, Skull } from "lucide-react";

export type SentimentClass = "positive" | "negative" | "sarcastic" | "neutral" | null;
export type SimPhase = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface FinalScore {
  sila2: number;
  sila3: number;
  verdict: "lulus" | "gagal";
  summary: string;
  sila2Label: string;
  sila3Label: string;
}

export interface SimulationSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  phase: SimPhase;
  userInitialComment: string;
  sentimentClass: SentimentClass;
  botProvocation: string | null;
  userFinalComment: string;
  finalScore: FinalScore | null;
  createdAt: Date;
}

interface SidebarProps {
  sessions: SimulationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

const PHASE_LABELS: Record<SimPhase, string> = {
  1: "Melihat Konten",
  2: "Komentar Awal",
  3: "Klasifikasi...",
  4: "Bot Menyerang",
  5: "Notifikasi!",
  6: "Balasan Final",
  7: "Hasil Rapor",
};

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isSidebarOpen,
  onCloseSidebar,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-800 bg-zinc-950 text-zinc-50 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center font-extrabold shadow-md text-lg">
            🔥
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent">
              War Comment Lab
            </h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Simulator Etika Digital</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseSidebar}
          className="md:hidden rounded-full h-8 w-8 text-zinc-400 hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* New Session Button */}
      <div className="p-4">
        <Button
          onClick={onNewSession}
          className="w-full justify-start gap-2 rounded-xl py-5 bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-600 hover:to-orange-500 text-white font-bold shadow-lg border-0"
        >
          <Plus className="h-4 w-4" />
          <span>Mulai Simulasi Baru</span>
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Riwayat ({sessions.length})
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-600 px-4">
            Belum ada simulasi.<br/>Pilih skenario untuk memulai!
          </div>
        ) : (
          sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const isDone = s.phase === 7 && s.finalScore !== null;
            const isLulus = isDone && s.finalScore?.verdict === "lulus";

            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`group flex items-center justify-between rounded-xl px-3 py-3 cursor-pointer select-none transition-all ${
                  isActive
                    ? "bg-zinc-800 text-white border border-zinc-700/60"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {isDone ? (
                    isLulus ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Skull className="h-4 w-4 text-rose-500 flex-shrink-0" />
                    )
                  ) : (
                    <Flame className="h-4 w-4 text-amber-500 flex-shrink-0 animate-pulse" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-zinc-100 text-xs font-semibold">{s.scenarioTitle}</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      {isDone ? (
                        <span className={`font-bold ${isLulus ? "text-emerald-400" : "text-rose-400"}`}>
                          {isLulus ? "🦅 Pancasialis" : "💀 Toxic Netizen"}
                        </span>
                      ) : (
                        <>
                          <span>Fase {s.phase}:</span>
                          <span>{PHASE_LABELS[s.phase]}</span>
                        </>
                      )}
                      {isDone && s.finalScore && (
                        <span className="inline-flex items-center gap-0.5 ml-1 bg-zinc-900 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] border border-zinc-700 text-amber-400">
                          <Award className="h-2.5 w-2.5" />
                          {Math.round((s.finalScore.sila2 + s.finalScore.sila3) / 2)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onDeleteSession(e, s.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-rose-400 h-6 w-6 rounded-md flex-shrink-0 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold text-zinc-400">Sistem Aktif</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-600">v2.0.0</span>
        </div>
      </div>
    </aside>
  );
}

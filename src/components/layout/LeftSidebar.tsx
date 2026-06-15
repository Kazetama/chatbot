"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Flame, Home, BookOpen, History, LogOut, Trophy,
  CheckCircle2, Skull, ChevronRight, Zap
} from "lucide-react";
import { SimulationSession, SimPhase } from "@/components/Sidebar";

interface Scenario {
  id: string;
  shortTitle: string;
  difficulty: string;
}

const NAV_ITEMS = [
  { icon: Home, label: "Beranda", active: true },
  { icon: BookOpen, label: "Skenario" },
  { icon: History, label: "Riwayat" },
];

const PHASE_LABELS: Record<SimPhase, string> = {
  1: "Melihat Konten",
  2: "Komentar Awal",
  3: "Klasifikasi...",
  4: "Bot Menyerang",
  5: "Notifikasi!",
  6: "Balasan Final",
  7: "Hasil Rapor",
};

interface LeftSidebarProps {
  username: string;
  scenarios: Scenario[];
  sessions: SimulationSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onLogout: () => void;
}

export default function LeftSidebar({
  username,
  scenarios,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onLogout,
}: LeftSidebarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <aside className="h-full flex flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
          <Flame className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-indigo-700 tracking-tight leading-none">War Comment</p>
          <p className="text-[10px] text-muted-foreground font-medium">Simulator Etika Digital</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
            {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
          </button>
        ))}
      </nav>

      <Separator />

      {/* New Simulation Button */}
      <div className="px-3 py-3">
        <Button
          onClick={onNewSession}
          className="w-full rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 shadow-sm shadow-indigo-200"
        >
          <Zap className="h-3.5 w-3.5" />
          Simulasi Baru
        </Button>
      </div>

      {/* Scenarios List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1.5">
          Skenario
        </p>
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={onNewSession}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left hover:bg-muted transition-colors group"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
              {sc.shortTitle.charAt(0)}
            </div>
            <span className="text-muted-foreground font-medium group-hover:text-foreground truncate">{sc.shortTitle}</span>
            <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
          </button>
        ))}

        {sessions.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1.5 mt-2">
              Riwayat ({sessions.length})
            </p>
            {sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const isDone = s.phase === 7 && s.finalScore !== null;
              const isLulus = isDone && s.finalScore?.verdict === "lulus";
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                    isActive ? "bg-indigo-50 border border-indigo-100" : "hover:bg-muted"
                  }`}
                >
                  {isDone ? (
                    isLulus ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Skull className="h-4 w-4 text-rose-500 flex-shrink-0" />
                    )
                  ) : (
                    <Flame className="h-4 w-4 text-amber-500 flex-shrink-0 animate-pulse" />
                  )}
                  <div className="min-w-0">
                    <p className={`truncate font-medium ${isActive ? "text-indigo-700" : "text-foreground"}`}>
                      {s.scenarioTitle}
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      {isDone
                        ? isLulus ? "🦅 Pancasialis" : "💀 Toxic Netizen"
                        : `Fase ${s.phase}: ${PHASE_LABELS[s.phase]}`}
                    </p>
                  </div>
                  {isDone && s.finalScore && (
                    <div className="ml-auto flex items-center gap-0.5 text-[10px] font-mono font-bold text-amber-600 flex-shrink-0">
                      <Trophy className="h-3 w-3" />
                      {Math.round((s.finalScore.sila2 + s.finalScore.sila3) / 2)}
                    </div>
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>

      <Separator />

      {/* User Profile */}
      <div className="px-3 py-3 flex items-center gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-extrabold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{username}</p>
          <p className="text-[10px] text-muted-foreground">@{username.toLowerCase().replace(/\s+/g, "_")}</p>
        </div>
        <button
          onClick={onLogout}
          className="text-muted-foreground hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
          title="Keluar"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

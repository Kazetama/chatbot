"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Sidebar, { SimulationSession, SimPhase, SentimentClass, FinalScore } from "@/components/Sidebar";
import {
  Menu, Plus, Send, ChevronDown, Loader2, AlertTriangle,
  Shield, Users, RefreshCcw, Share2, MessageCircle,
  Heart, Repeat2, Bookmark, MoreHorizontal, ThumbsUp, ThumbsDown, Zap
} from "lucide-react";

// ─── Scenario Definition ────────────────────────────────────────────────────
interface Scenario {
  id: string;
  title: string;
  shortTitle: string;
  platform: "Twitter/X" | "Facebook" | "Instagram" | "TikTok";
  posterName: string;
  posterHandle: string;
  posterAvatar: string;
  postCaption: string;
  postImage: string;
  postTime: string;
  likes: string;
  shares: string;
  comments: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
}

const SCENARIOS: Scenario[] = [
  {
    id: "bapak-motor",
    title: "Bapak-bapak vs Pengendara Motor",
    shortTitle: "Bapak vs Motor",
    platform: "Facebook",
    posterName: "Berita Viral Nusantara",
    posterHandle: "@BeritaViralNusantara",
    posterAvatar: "BV",
    postCaption:
      '⚠️ VIRAL! Arogan banget! Pengendara motor lagi diam tiba-tiba dibogem sama warga lokal ini. Lihat sendiri kelakuan orang ini! Tolong viralkan biar dipenjara! Bagikan sebanyak-banyaknya agar dapat keadilan! 😡🔥',
    postImage: "/confrontation.png",
    postTime: "2 jam yang lalu",
    likes: "14.2K",
    shares: "8.7K",
    comments: "3.1K",
    difficulty: "Mudah",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const makeId = () => `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const SENTIMENT_META: Record<
  Exclude<SentimentClass, null>,
  { label: string; emoji: string; color: string; bg: string; border: string }
> = {
  positive: { label: "Positif", emoji: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  negative: { label: "Negatif", emoji: "🔴", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
  sarcastic: { label: "Sarkas", emoji: "😏", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  neutral: { label: "Netral", emoji: "⚪", color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Phase Banner
function PhaseBanner({
  phase,
  text,
  icon,
  color,
}: {
  phase: number;
  text: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`w-full rounded-2xl p-4 border flex items-start gap-3 mb-6 animate-in slide-in-from-bottom-4 duration-500 ${color}`}
    >
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Fase {phase}</div>
        <p className="text-sm font-semibold leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// Social Post Card
function PostCard({ scenario, onScrollToComments }: { scenario: Scenario; onScrollToComments: () => void }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Platform badge */}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-xs font-bold">
        <span>📘 Facebook</span>
        <span className="opacity-70">{scenario.postTime}</span>
      </div>

      {/* Poster info */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
          {scenario.posterAvatar}
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white">{scenario.posterName}</p>
          <p className="text-[10px] text-zinc-500">{scenario.posterHandle} · {scenario.postTime}</p>
        </div>
        <button className="ml-auto text-zinc-400 hover:text-zinc-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{scenario.postCaption}</p>
      </div>

        <div className="relative overflow-hidden">
          <Image
            src={scenario.postImage}
            alt="Konten Viral"
            width={600}
            height={400}
            className="w-full object-cover max-h-72 select-none"
            draggable={false}
          />
        {/* Overlay grain effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
          REC ● 18:42
        </div>
      </div>

      {/* Engagement stats */}
      <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <span>❤️😠😮 {scenario.likes} Reaksi</span>
        <span>{scenario.comments} Komentar · {scenario.shares} Dibagikan</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center px-2 py-1">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <ThumbsUp className="h-4 w-4" /> Suka
        </button>
        <button
          onClick={onScrollToComments}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors text-xs font-bold text-rose-500"
        >
          <MessageCircle className="h-4 w-4" /> Komentar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <Share2 className="h-4 w-4" /> Bagikan
        </button>
      </div>
    </div>
  );
}

// Hot Comments Section (fake comments)
function HotComments() {
  const fakeComments = [
    { avatar: "AJ", name: "Andi Jatmika", text: "Ini udah keterlaluan! Gak ada rasa hormat sama sekali!", time: "1j", likes: 847, color: "bg-rose-500" },
    { avatar: "SR", name: "Sari Rahmawati", text: "Harap cari tahu dulu kronologinya, jangan langsung nge-judge...", time: "45m", likes: 234, color: "bg-sky-500" },
    { avatar: "DK", name: "Dedi K", text: "WKWKWK pahlawan kampung nih 💀", time: "32m", likes: 1204, color: "bg-amber-500" },
    { avatar: "RP", name: "Rizky Pratama", text: "Lapor polisi aja min, jangan main hakim sendiri", time: "28m", likes: 89, color: "bg-emerald-500" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-3 mt-4">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-1">Komentar Teratas ↓</p>
      {fakeComments.map((c, i) => (
        <div key={i} className="flex gap-2.5 items-start">
          <div className={`h-8 w-8 rounded-full ${c.color} text-white text-[10px] font-extrabold flex-shrink-0 flex items-center justify-center`}>
            {c.avatar}
          </div>
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/70 rounded-2xl px-3 py-2">
            <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{c.name} <span className="font-normal text-zinc-400">· {c.time}</span></p>
            <p className="text-xs text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">{c.text}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <button className="text-[10px] text-zinc-500 hover:text-rose-500 flex items-center gap-0.5 transition-colors">
                <Heart className="h-3 w-3" /> {c.likes}
              </button>
              <button className="text-[10px] text-zinc-500 hover:text-blue-500 transition-colors">Balas</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Bot Provocation Card
function BotComment({ text, isRevealing }: { text: string; isRevealing: boolean }) {
  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-2xl border-2 border-rose-500/60 bg-rose-950/30 p-4 shadow-lg shadow-rose-900/20 transition-all duration-700 ${
        isRevealing ? "animate-in slide-in-from-top-4 duration-700" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rose-600 to-red-700 text-white flex items-center justify-center font-extrabold text-sm animate-pulse">
          👾
        </div>
        <div>
          <p className="text-xs font-black text-rose-400">@provocateur_bot</p>
          <p className="text-[9px] text-zinc-500">Baru saja · membalas komentar Anda</p>
        </div>
        <div className="ml-auto flex items-center gap-1 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
          <Zap className="h-3 w-3 text-rose-400 animate-pulse" />
          <span className="text-[9px] font-black text-rose-400">MENYERANG</span>
        </div>
      </div>
      <p className="text-sm text-zinc-100 leading-relaxed font-medium">{text}</p>
      <div className="flex items-center gap-4 mt-3 text-zinc-600">
        <button className="flex items-center gap-1 text-[10px] hover:text-rose-400 transition-colors">
          <ThumbsUp className="h-3 w-3" /> 892
        </button>
        <button className="flex items-center gap-1 text-[10px] hover:text-rose-400 transition-colors">
          <ThumbsDown className="h-3 w-3" /> 41
        </button>
        <button className="flex items-center gap-1 text-[10px] hover:text-sky-400 transition-colors">
          <Repeat2 className="h-3 w-3" /> 340
        </button>
        <button className="flex items-center gap-1 text-[10px] hover:text-amber-400 transition-colors">
          <Bookmark className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// Score Ring Component
function ScoreRing({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="rotate-[-90deg]" width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="8" fill="none" className="text-zinc-800" />
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-white">{value}</span>
        </div>
      </div>
      <p className="text-[10px] font-bold text-zinc-400 text-center uppercase tracking-wide">{label}</p>
    </div>
  );
}

// Final Score Card
function FinalScoreCard({
  score,
  onRetry,
}: {
  score: FinalScore;
  onRetry: () => void;
}) {
  const isLulus = score.verdict === "lulus";

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-3xl border-2 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700 ${
        isLulus ? "border-emerald-500/50 bg-emerald-950/20" : "border-rose-500/50 bg-rose-950/20"
      }`}
    >
      {/* Verdict Header */}
      <div
        className={`p-6 flex flex-col items-center text-center ${
          isLulus ? "bg-emerald-500/10" : "bg-rose-500/10"
        }`}
      >
        <div className="text-5xl mb-3 animate-bounce">{isLulus ? "🦅" : "💀"}</div>
        <h3 className={`text-2xl font-black tracking-tight ${isLulus ? "text-emerald-400" : "text-rose-400"}`}>
          {isLulus ? "PANCASIALIS!" : "TOXIC NETIZEN"}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 font-medium">
          {isLulus ? "Anda lulus ujian etika digital Indonesia 🇮🇩" : "Anda terpancing provokasi digital ⚠️"}
        </p>
      </div>

      {/* Score Rings */}
      <div className="p-6 flex items-center justify-around border-b border-zinc-800">
        <ScoreRing
          value={score.sila2}
          label={`Sila ke-2 · ${score.sila2Label}`}
          color={score.sila2 >= 55 ? "text-emerald-500" : "text-rose-500"}
        />
        <div className="text-center">
          <div className="text-3xl font-black text-zinc-500">/</div>
        </div>
        <ScoreRing
          value={score.sila3}
          label={`Sila ke-3 · ${score.sila3Label}`}
          color={score.sila3 >= 55 ? "text-sky-500" : "text-rose-500"}
        />
      </div>

      {/* Summary */}
      <div className="p-5 space-y-4">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1 h-full ${isLulus ? "bg-emerald-500" : "bg-rose-500"}`}
          />
          <p className="text-xs text-zinc-300 leading-relaxed pl-2">{score.summary}</p>
        </div>

        {!isLulus && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1">
                  ⚠️ Peringatan Cyberbullying
                </p>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Respons seperti ini, jika diterapkan di media sosial nyata, dapat dikategorikan sebagai
                  ujaran kebencian dan provokasi berbahaya yang melanggar UU ITE Pasal 28 ayat 2.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex-1 rounded-xl gap-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            <RefreshCcw className="h-4 w-4" />
            Coba Lagi
          </Button>
          <Button className="flex-1 rounded-xl gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 border-0 text-white font-bold">
            <Share2 className="h-4 w-4" />
            Bagikan Hasil
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function Home() {
  const [sessions, setSessions] = useState<SimulationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Per-run local state (not persisted mid-session, only final)
  const [phase, setPhase] = useState<SimPhase>(1);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [userInitialComment, setUserInitialComment] = useState("");
  const [userFinalComment, setUserFinalComment] = useState("");
  const [sentimentClass, setSentimentClass] = useState<SentimentClass>(null);
  const [botProvocation, setBotProvocation] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [botRevealing, setBotRevealing] = useState(false);

  const commentsRef = useRef<HTMLDivElement>(null);
  const finalInputRef = useRef<HTMLInputElement>(null);

  // Persist sessions
  useEffect(() => {
    const saved = localStorage.getItem("kaze_war_sessions_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SimulationSession[];
        const hydrated = parsed.map((s) => ({ ...s, createdAt: new Date(s.createdAt) }));
        setTimeout(() => {
          setSessions(hydrated);
        }, 0);
      } catch { /* ignore */ }
    }
  }, []);

  const persistSessions = (updated: SimulationSession[]) => {
    setSessions(updated);
    localStorage.setItem("kaze_war_sessions_v2", JSON.stringify(updated));
  };

  // Load active session from history
  const loadSession = (id: string) => {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    const scenario = SCENARIOS.find((sc) => sc.id === s.scenarioId);
    if (scenario) setSelectedScenario(scenario);
    setPhase(s.phase);
    setUserInitialComment(s.userInitialComment);
    setSentimentClass(s.sentimentClass);
    setBotProvocation(s.botProvocation);
    setUserFinalComment(s.userFinalComment);
    setFinalScore(s.finalScore);
    setActiveSessionId(id);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    persistSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId("");
      setSelectedScenario(null);
      setPhase(1);
    }
  };

  const resetAll = () => {
    setSelectedScenario(null);
    setPhase(1);
    setUserInitialComment("");
    setUserFinalComment("");
    setSentimentClass(null);
    setBotProvocation(null);
    setFinalScore(null);
    setActiveSessionId("");
    setFlashRed(false);
    setBotRevealing(false);
  };

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setPhase(1);
    setUserInitialComment("");
    setUserFinalComment("");
    setSentimentClass(null);
    setBotProvocation(null);
    setFinalScore(null);
    setActiveSessionId(makeId());
    setIsSidebarOpen(false);
  };

  const scrollToComments = () => {
    setPhase(2);
    setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Phase 3: classify
  const handleSubmitInitialComment = async () => {
    if (!userInitialComment.trim() || isLoading) return;
    setIsLoading(true);
    setPhase(3);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "classify", userComment: userInitialComment.trim() }),
      });
      const data = await res.json();
      const cls: SentimentClass = data.sentimentClass ?? "neutral";
      const botReply: string = data.botReply ?? "Halah! Gitu aja heboh.";

      setSentimentClass(cls);
      setBotProvocation(botReply);

      // Phase 4: show bot reply dramatically
      setTimeout(() => {
        setPhase(4);
        setBotRevealing(true);
        setTimeout(() => {
          // Phase 5: flash notification
          setPhase(5);
          setFlashRed(true);
          setTimeout(() => {
            setFlashRed(false);
            setPhase(6);
            setTimeout(() => finalInputRef.current?.focus(), 300);
          }, 1800);
        }, 2500);
      }, 1000);
    } catch {
      setSentimentClass("neutral");
      setBotProvocation("Bot sedang offline. Coba lagi.");
      setPhase(4);
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 7: evaluate
  const handleSubmitFinalComment = async () => {
    if (!userFinalComment.trim() || isLoading || !selectedScenario) return;
    setIsLoading(true);
    setPhase(7);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          scenarioTitle: selectedScenario.title,
          botProvocation: botProvocation ?? "",
          sentimentClass: sentimentClass ?? "neutral",
          userFinalComment: userFinalComment.trim(),
        }),
      });
      const data = await res.json();
      const score: FinalScore = {
        sila2: data.sila2 ?? 50,
        sila3: data.sila3 ?? 50,
        verdict: data.verdict ?? "gagal",
        summary: data.summary ?? "Evaluasi tidak tersedia.",
        sila2Label: data.sila2Label ?? "-",
        sila3Label: data.sila3Label ?? "-",
      };
      setFinalScore(score);

      // Persist completed session
      const sessionRecord: SimulationSession = {
        id: activeSessionId || makeId(),
        scenarioId: selectedScenario.id,
        scenarioTitle: selectedScenario.shortTitle,
        phase: 7,
        userInitialComment: userInitialComment.trim(),
        sentimentClass,
        botProvocation,
        userFinalComment: userFinalComment.trim(),
        finalScore: score,
        createdAt: new Date(),
      };
      persistSessions([sessionRecord, ...sessions.filter((s) => s.id !== sessionRecord.id)]);
    } catch {
      setPhase(6);
      alert("Gagal memproses evaluasi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-zinc-950 text-white transition-colors duration-300 ${
        flashRed ? "bg-rose-950" : ""
      }`}
    >
      {/* Flash overlay */}
      {flashRed && (
        <div className="fixed inset-0 z-50 bg-rose-600/20 pointer-events-none animate-pulse" />
      )}

      {/* Notification popup phase 5 */}
      {phase === 5 && (
        <div className="fixed top-5 right-5 z-50 bg-rose-600 text-white px-5 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-500 flex items-start gap-3 max-w-xs">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 animate-bounce" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide">Komentar Anda Diserang!</p>
            <p className="text-[11px] text-rose-100 mt-0.5">
              @provocateur_bot membalas komentar Anda dengan nada provokatif!
            </p>
          </div>
        </div>
      )}

      {/* Mobile Top Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="rounded-full text-zinc-400">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-sm bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent">
            War Comment Lab
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={resetAll} className="rounded-full text-zinc-400">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={loadSession}
        onNewSession={resetAll}
        onDeleteSession={deleteSession}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pt-14 md:pt-0">

        {/* ── Landing: Scenario Selection ────────────────────────────────── */}
        {!selectedScenario && (
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 text-3xl shadow-lg shadow-rose-900/30 mx-auto">
                  🔥
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">
                  War Comment Lab
                </h1>
                <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Simulator interaktif etika bermedia sosial. Hadapi provokasi di kolom komentar,
                  dan buktikan bahwa Anda adalah netizen yang bijak dan berjiwa Pancasila.
                </p>
              </div>

              {/* Info pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                {["7 Fase Simulasi", "Evaluasi AI Gemini", "Penilaian Sila ke-2 & ke-3", "Berbasis Kasus Nyata"].map((t) => (
                  <span key={t} className="text-[10px] font-bold text-zinc-400 border border-zinc-800 rounded-full px-3 py-1 bg-zinc-900">
                    {t}
                  </span>
                ))}
              </div>

              {/* Scenario Cards */}
              <div className="grid gap-5">
                {SCENARIOS.map((sc) => (
                  <div
                    key={sc.id}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden transition-all hover:-translate-y-1 duration-200 shadow-lg cursor-pointer group"
                    onClick={() => startScenario(sc)}
                  >
                    <div className="relative overflow-hidden h-44">
                      <Image
                      src={sc.postImage}
                      alt={sc.title}
                      width={600}
                      height={176}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 block">{sc.platform}</span>
                        <h3 className="text-base font-extrabold text-white leading-tight">{sc.title}</h3>
                      </div>
                      <span className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                        {sc.difficulty}
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-xs text-zinc-500 line-clamp-1 flex-1 mr-3">{sc.postCaption}</p>
                      <Button className="rounded-xl text-xs px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold border-0 flex-shrink-0">
                        Mulai →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Active Simulation ───────────────────────────────────────────── */}
        {selectedScenario && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32">

              {/* Phase 1 – Post Card */}
              {phase >= 1 && (
                <div className="space-y-4">
                  <PhaseBanner
                    phase={1}
                    text="Sebuah video viral beredar dan memancing perdebatan sengit. Perhatikan konten ini baik-baik sebelum bereaksi."
                    icon={<span className="text-lg">📲</span>}
                    color="bg-zinc-900 border-zinc-700 text-zinc-200"
                  />
                  <PostCard scenario={selectedScenario} onScrollToComments={scrollToComments} />
                  <HotComments />

                  {phase === 1 && (
                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={scrollToComments}
                        className="rounded-2xl gap-2 bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-600 hover:to-orange-500 font-bold border-0 text-white animate-bounce"
                      >
                        <ChevronDown className="h-4 w-4" />
                        Gulir ke Kolom Komentar
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Phase 2 – Initial Comment Input */}
              {phase >= 2 && (
                <div ref={commentsRef} className="space-y-4">
                  <PhaseBanner
                    phase={2}
                    text='Situasi memanas dan memicu konflik antarkelompok! Sebagai netizen yang kritis, ketikkan 1 kalimat komentarmu terhadap video di atas.'
                    icon={<MessageCircle className="h-5 w-5 text-amber-400" />}
                    color="bg-amber-950/30 border-amber-500/30 text-amber-100"
                  />

                  {phase === 2 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                          AK
                        </div>
                        <span className="text-xs font-bold text-zinc-300">Anda (Akun Anda)</span>
                      </div>
                      <input
                        type="text"
                        value={userInitialComment}
                        onChange={(e) => setUserInitialComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmitInitialComment()}
                        placeholder="Tulis komentar pertamamu di sini... (tekan Enter atau klik Kirim)"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmitInitialComment}
                          disabled={!userInitialComment.trim() || isLoading}
                          className="rounded-xl gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold border-0 disabled:opacity-40"
                        >
                          <Send className="h-4 w-4" /> Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Phase 3 – Classification Loading */}
              {phase === 3 && (
                <div className="space-y-4">
                  {/* Show submitted comment */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-black">AK</div>
                      <span className="text-xs font-bold text-zinc-300">Komentar Anda</span>
                    </div>
                    <p className="text-sm text-zinc-200 pl-9">{userInitialComment}</p>
                  </div>
                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-5 flex items-center gap-4">
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-blue-300">Sistem menganalisis komentar Anda...</p>
                      <p className="text-[11px] text-blue-400/70 mt-0.5">Mengklasifikasikan sentimen dan mempersiapkan respons warganet.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phase 4 – Bot Provocation Reveal */}
              {(phase === 4 || phase === 5 || phase === 6 || phase === 7) && sentimentClass && botProvocation && (
                <div className="space-y-4">
                  {/* Submitted comment */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">AK</div>
                      <span className="text-xs font-bold text-zinc-300">Komentar Anda</span>
                      {/* Sentiment badge */}
                      <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full border ${SENTIMENT_META[sentimentClass].bg} ${SENTIMENT_META[sentimentClass].border} ${SENTIMENT_META[sentimentClass].color}`}>
                        {SENTIMENT_META[sentimentClass].emoji} {SENTIMENT_META[sentimentClass].label}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-200 pl-9">{userInitialComment}</p>
                  </div>

                  {/* Bot reply */}
                  <BotComment text={botProvocation} isRevealing={botRevealing} />
                </div>
              )}

              {/* Phase 6 – Final Comment Input */}
              {phase === 6 && (
                <div className="space-y-4">
                  <PhaseBanner
                    phase={6}
                    text="Seseorang baru saja membalas komentarmu dengan nada provokatif. Bagaimana kamu menyikapi komentar ini? Tuliskan jawaban finalmu di bawah!"
                    icon={<AlertTriangle className="h-5 w-5 text-orange-400" />}
                    color="bg-orange-950/30 border-orange-500/30 text-orange-100"
                  />
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0">AK</div>
                      <span className="text-xs font-bold text-zinc-300">Jawaban Final Anda</span>
                    </div>
                    <input
                      ref={finalInputRef}
                      type="text"
                      value={userFinalComment}
                      onChange={(e) => setUserFinalComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitFinalComment()}
                      placeholder="Tuliskan respons bijak Anda menghadapi provokasi ini..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitFinalComment}
                        disabled={!userFinalComment.trim() || isLoading}
                        className="rounded-xl gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold border-0 disabled:opacity-40"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                        {isLoading ? "Mengevaluasi..." : "Kirim & Evaluasi"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Phase 7 – Results Loading */}
              {phase === 7 && !finalScore && (
                <div className="bg-violet-950/30 border border-violet-500/30 rounded-2xl p-5 flex items-center gap-4">
                  <Loader2 className="h-6 w-6 text-violet-400 animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-violet-300">Gemini AI sedang menilai etika digitalmu...</p>
                    <p className="text-[11px] text-violet-400/70 mt-0.5">Evaluasi berdasarkan Sila ke-2 dan ke-3 Pancasila.</p>
                  </div>
                </div>
              )}

              {/* Phase 7 – Final Score Card */}
              {phase === 7 && finalScore && selectedScenario && (
                <div className="space-y-4">
                  <PhaseBanner
                    phase={7}
                    text="Berikut adalah rapor etika digitalmu berdasarkan nilai-nilai Pancasila."
                    icon={<Users className="h-5 w-5 text-violet-400" />}
                    color="bg-violet-950/30 border-violet-500/30 text-violet-100"
                  />
                  <FinalScoreCard
                    score={finalScore}
                    onRetry={() => startScenario(selectedScenario)}
                  />
                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

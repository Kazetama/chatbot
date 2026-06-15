"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimulationSession, SimPhase, SentimentClass, FinalScore } from "@/components/Sidebar";
import ScenarioFeed from "@/components/simulation/ScenarioFeed";
import FakeComments from "@/components/simulation/FakeComments";
import PhaseInstructor from "@/components/simulation/PhaseInstructor";
import CommentInput from "@/components/simulation/CommentInput";
import ClassifyingLoader from "@/components/simulation/ClassifyingLoader";
import BotReplyCard from "@/components/simulation/BotReplyCard";
import AttackNotification from "@/components/simulation/AttackNotification";
import ScoreReport from "@/components/simulation/ScoreReport";
import {
  ChevronDown, MessageCircle, AlertTriangle, Loader2,
  Sparkles, BookOpen, RotateCcw
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ScenarioDef {
  id: string;
  shortTitle: string;
  title: string;
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

// ─── Scenario Data ────────────────────────────────────────────────────────────
export const SCENARIOS: ScenarioDef[] = [
  {
    id: "bapak-motor",
    shortTitle: "Bapak vs Motor",
    title: "Bapak-bapak vs Pengendara Motor",
    platform: "Facebook",
    posterName: "Berita Viral Nusantara",
    posterHandle: "@BeritaViralNusantara",
    posterAvatar: "BV",
    postCaption:
      "⚠️ VIRAL! Arogan banget! Pengendara motor lagi diam tiba-tiba dibogem sama warga lokal ini. Tolong viralkan biar dipenjara! Bagikan sebanyak-banyaknya agar dapat keadilan! 😡🔥",
    postImage: "/confrontation.png",
    postTime: "2 jam yang lalu",
    likes: "14.2K",
    shares: "8.7K",
    comments: "3.1K",
    difficulty: "Mudah",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeId = () => `sim_${Date.now()}`;

// ─── Props ────────────────────────────────────────────────────────────────────
interface SimulationOrchestratorProps {
  username: string;
  onSessionUpdate: (session: SimulationSession) => void;
  onPhaseChange?: (phase: SimPhase | null, title?: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SimulationOrchestrator({
  username,
  onSessionUpdate,
  onPhaseChange,
}: SimulationOrchestratorProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDef | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [phase, setPhase] = useState<SimPhase>(1);

  const [initialComment, setInitialComment] = useState("");
  const [finalComment, setFinalComment] = useState("");

  const [sentimentClass, setSentimentClass] = useState<SentimentClass>(null);
  const [botProvocation, setBotProvocation] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const commentSectionRef = useRef<HTMLDivElement>(null);

  const goPhase = useCallback((p: SimPhase, scenario?: ScenarioDef) => {
    setPhase(p);
    onPhaseChange?.(p, (scenario ?? selectedScenario)?.title);
  }, [onPhaseChange, selectedScenario]);

  // ── Start scenario ──────────────────────────────────────────────────────────
  const startScenario = (sc: ScenarioDef) => {
    const id = makeId();
    setSelectedScenario(sc);
    setSessionId(id);
    setPhase(1);
    setInitialComment("");
    setFinalComment("");
    setSentimentClass(null);
    setBotProvocation(null);
    setFinalScore(null);
    onPhaseChange?.(1, sc.title);
  };

  // ── Phase 2: scroll to comment area ─────────────────────────────────────────
  const scrollToComments = () => {
    goPhase(2);
    setTimeout(() => commentSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // ── Phase 3: classify initial comment ───────────────────────────────────────
  const handleSubmitInitial = async () => {
    if (!initialComment.trim() || isLoading) return;
    setIsLoading(true);
    goPhase(3);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "classify", userComment: initialComment.trim() }),
      });
      const data = await res.json();
      const cls: SentimentClass = data.sentimentClass ?? "neutral";
      const botReply: string = data.botReply ?? "Hmm, coba lagi.";

      setSentimentClass(cls);
      setBotProvocation(botReply);

      // Phase 4 → 5 → 6
      setTimeout(() => {
        goPhase(4);
        setTimeout(() => {
          setShowNotification(true);
          goPhase(5);
          setTimeout(() => {
            goPhase(6);
          }, 2500);
        }, 1500);
      }, 800);
    } catch {
      setSentimentClass("neutral");
      setBotProvocation("Bot sedang offline. Coba lagi nanti.");
      goPhase(4);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Phase 7: evaluate final comment ─────────────────────────────────────────
  const handleSubmitFinal = async () => {
    if (!finalComment.trim() || isLoading || !selectedScenario) return;
    setIsLoading(true);
    goPhase(7);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          scenarioTitle: selectedScenario.title,
          botProvocation: botProvocation ?? "",
          sentimentClass: sentimentClass ?? "neutral",
          userFinalComment: finalComment.trim(),
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

      const session: SimulationSession = {
        id: sessionId || makeId(),
        scenarioId: selectedScenario.id,
        scenarioTitle: selectedScenario.shortTitle,
        phase: 7,
        userInitialComment: initialComment.trim(),
        sentimentClass,
        botProvocation,
        userFinalComment: finalComment.trim(),
        finalScore: score,
        createdAt: new Date(),
      };
      onSessionUpdate(session);
    } catch {
      setPhase(6);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (selectedScenario) startScenario(selectedScenario);
  };

  // ── Scenario Selection Landing ──────────────────────────────────────────────
  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Pilih Skenario Simulasi
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            War Comment Lab 🔥
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Hadapi provokasi media sosial. Buktikan kamu netizen yang bijak dan berjiwa Pancasila.
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-4">
          {SCENARIOS.map((sc) => (
            <Card
              key={sc.id}
              className="rounded-2xl border-border shadow-sm hover:shadow-md bg-white overflow-hidden cursor-pointer group transition-all hover:-translate-y-0.5 duration-200"
              onClick={() => startScenario(sc)}
            >
              <div className="relative overflow-hidden h-40">
                <Image
                  src={sc.postImage}
                  alt={sc.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <Badge className="mb-2 text-[10px] bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    📘 {sc.platform}
                  </Badge>
                  <h3 className="text-base font-extrabold leading-tight">{sc.title}</h3>
                </div>
                <Badge
                  className="absolute top-3 right-3 text-[10px] bg-white/90 text-emerald-700 border-emerald-200 font-bold"
                  variant="outline"
                >
                  {sc.difficulty}
                </Badge>
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{sc.postCaption}</p>
                <Button
                  className="rounded-xl text-xs px-4 h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-0 flex-shrink-0 gap-1"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Mulai
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ── Active Simulation ────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Phase 5 Attack Notification */}
      {showNotification && phase >= 5 && (
        <AttackNotification onDismiss={() => setShowNotification(false)} />
      )}

      {/* Phase 1: Post Card */}
      {phase >= 1 && (
        <>
          <PhaseInstructor
            phase={1}
            title="Melihat Konten"
            description="Sebuah video viral beredar dan memancing perdebatan sengit. Perhatikan konten ini baik-baik sebelum bereaksi."
            icon={<MessageCircle className="h-4 w-4" />}
            variant="info"
          />
          <ScenarioFeed
            platform={selectedScenario.platform}
            posterName={selectedScenario.posterName}
            posterHandle={selectedScenario.posterHandle}
            posterAvatar={selectedScenario.posterAvatar}
            postCaption={selectedScenario.postCaption}
            postImage={selectedScenario.postImage}
            postTime={selectedScenario.postTime}
            likes={selectedScenario.likes}
            shares={selectedScenario.shares}
            comments={selectedScenario.comments}
            difficulty={selectedScenario.difficulty}
            onScrollToComments={scrollToComments}
          />
          <FakeComments />

          {phase === 1 && (
            <div className="flex justify-center">
              <Button
                onClick={scrollToComments}
                className="rounded-2xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-0 shadow-sm"
              >
                <ChevronDown className="h-4 w-4" />
                Gulir ke Kolom Komentar
              </Button>
            </div>
          )}
        </>
      )}

      {/* Phase 2: Initial Comment */}
      {phase >= 2 && (
        <div ref={commentSectionRef} className="space-y-3">
          <PhaseInstructor
            phase={2}
            title="Berikan Komentar Pertamamu"
            description="Situasi memanas! Sebagai netizen yang kritis, ketikkan 1 kalimat komentarmu terhadap konten di atas."
            icon={<MessageCircle className="h-4 w-4" />}
            variant="warning"
          />
          {phase === 2 && (
            <CommentInput
              username={username}
              value={initialComment}
              onChange={setInitialComment}
              onSend={handleSubmitInitial}
              placeholder="Ketik komentarmu di sini... (tekan Enter untuk kirim)"
              disabled={isLoading}
            />
          )}
        </div>
      )}

      {/* Phase 3: Classifying */}
      {phase === 3 && initialComment && (
        <ClassifyingLoader comment={initialComment} />
      )}

      {/* Phase 4–6: Bot Reply visible */}
      {phase >= 4 && sentimentClass && botProvocation && (
        <div className="space-y-3">
          <PhaseInstructor
            phase={4}
            title="Bot Menyerang!"
            description="Warganet membalas komentarmu dengan nada provokatif. Lihat bagaimana pola provokasi ini bekerja."
            icon={<AlertTriangle className="h-4 w-4" />}
            variant="danger"
          />
          <BotReplyCard
            botText={botProvocation}
            sentimentClass={sentimentClass}
            userComment={initialComment}
            username={username}
          />
        </div>
      )}

      {/* Phase 6: Final Comment */}
      {phase === 6 && (
        <div className="space-y-3">
          <PhaseInstructor
            phase={6}
            title="Bagaimana Responmu?"
            description="Seseorang baru saja menyerang komentarmu. Bagaimana kamu menyikapi provokasi ini? Tuliskan jawaban finalmu."
            icon={<AlertTriangle className="h-4 w-4" />}
            variant="danger"
          />
          <CommentInput
            username={username}
            value={finalComment}
            onChange={setFinalComment}
            onSend={handleSubmitFinal}
            placeholder="Tuliskan respons bijak Anda menghadapi provokasi ini..."
            disabled={isLoading}
            replyToUsername="@provocateur_bot"
          />
        </div>
      )}

      {/* Phase 7: Evaluating loader */}
      {phase === 7 && !finalScore && (
        <Card className="rounded-2xl border-indigo-100 bg-indigo-50/50 shadow-sm p-5 animate-fade-up">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-indigo-700">Gemini AI sedang menilai etika digitalmu...</p>
              <p className="text-xs text-indigo-500 mt-0.5">Evaluasi berdasarkan Sila ke-2 dan ke-3 Pancasila.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Phase 7: Score Report */}
      {phase === 7 && finalScore && (
        <div className="space-y-3">
          <PhaseInstructor
            phase={7}
            title="Rapor Etika Digital"
            description="Berikut hasil penilaian etika digitalmu berdasarkan nilai-nilai Pancasila."
            icon={<Sparkles className="h-4 w-4" />}
            variant="success"
          />
          <ScoreReport
            score={finalScore}
            username={username}
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Reset button (non-phase-7) */}
      {phase > 1 && phase < 7 && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleRetry}
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs text-muted-foreground gap-1.5 hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Ulangi Skenario
          </Button>
        </div>
      )}
    </div>
  );
}

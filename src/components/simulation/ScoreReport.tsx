"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FinalScore } from "@/components/Sidebar";
import {
  Trophy, AlertTriangle, RefreshCcw, Share2,
  CheckCircle2, XCircle, Shield, Users
} from "lucide-react";

interface ScoreReportProps {
  score: FinalScore;
  username: string;
  onRetry: () => void;
}

function ScoreRing({ value, label, color, icon }: {
  value: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="rotate-[-90deg]" width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="7" fill="none" className="text-slate-100" />
          <circle
            cx="48" cy="48" r="38"
            stroke="currentColor" strokeWidth="7" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-foreground">{value}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-center">
        {icon}
        <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function ScoreReport({ score, username, onRetry }: ScoreReportProps) {
  const isLulus = score.verdict === "lulus";
  const avgScore = Math.round((score.sila2 + score.sila3) / 2);

  return (
    <Card className="rounded-2xl border-border shadow-sm bg-white overflow-hidden animate-fade-up">
      {/* Top accent */}
      <div className={`h-1.5 ${isLulus ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-rose-400 to-red-500"}`} />

      {/* Verdict Header */}
      <div className={`p-6 text-center ${isLulus ? "bg-emerald-50/60" : "bg-rose-50/60"}`}>
        <div className="text-4xl mb-2">{isLulus ? "🦅" : "💀"}</div>
        <h3 className={`text-xl font-extrabold tracking-tight ${isLulus ? "text-emerald-700" : "text-rose-700"}`}>
          {isLulus ? "PANCASIALIS!" : "TOXIC NETIZEN"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {username} · Skor Rata-rata:{" "}
          <span className="font-bold text-foreground">{avgScore}/100</span>
        </p>
        <Badge
          className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
            isLulus
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-rose-100 text-rose-700 border-rose-200"
          }`}
          variant="outline"
        >
          {isLulus ? (
            <><CheckCircle2 className="h-3 w-3 mr-1" /> Lulus Uji Etika Digital</>
          ) : (
            <><XCircle className="h-3 w-3 mr-1" /> Gagal Uji Etika Digital</>
          )}
        </Badge>
      </div>

      <Separator />

      {/* Score Rings */}
      <div className="p-6 flex items-center justify-around">
        <ScoreRing
          value={score.sila2}
          label={`Sila ke-2 · ${score.sila2Label}`}
          color={score.sila2 >= 55 ? "text-emerald-500" : "text-rose-500"}
          icon={<Shield className="h-3 w-3 text-muted-foreground" />}
        />
        <div className="text-center">
          <Trophy className="h-6 w-6 text-amber-400 mx-auto" />
          <p className="text-2xl font-black text-foreground mt-1">{avgScore}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <ScoreRing
          value={score.sila3}
          label={`Sila ke-3 · ${score.sila3Label}`}
          color={score.sila3 >= 55 ? "text-sky-500" : "text-rose-500"}
          icon={<Users className="h-3 w-3 text-muted-foreground" />}
        />
      </div>

      <Separator />

      {/* Summary */}
      <div className="p-5 space-y-4">
        <div className={`rounded-xl p-4 border-l-4 ${isLulus ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-slate-300"}`}>
          <p className="text-xs text-foreground leading-relaxed">{score.summary}</p>
        </div>

        {!isLulus && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">⚠️ Peringatan Etika Digital</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Respons seperti ini di media sosial nyata dapat dikategorikan sebagai ujaran kebencian
                yang melanggar <strong>UU ITE Pasal 28 Ayat 2</strong>. Selalu bijak dalam berkomentar.
              </p>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="p-4 flex gap-3">
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 rounded-xl h-10 gap-2 text-sm font-semibold border-border"
        >
          <RefreshCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
        <Button
          className="flex-1 rounded-xl h-10 gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white border-0"
        >
          <Share2 className="h-4 w-4" />
          Bagikan Hasil
        </Button>
      </div>
    </Card>
  );
}

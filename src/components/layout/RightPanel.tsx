"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Lightbulb, CheckCircle2, Circle, Loader2,
  TrendingUp, Shield, Users
} from "lucide-react";
import { SimPhase } from "@/components/Sidebar";

interface RightPanelProps {
  scenarioTitle?: string;
  currentPhase: SimPhase | null;
  username: string;
}

const PHASES: { phase: SimPhase; label: string; desc: string }[] = [
  { phase: 1, label: "Lihat Konten", desc: "Perhatikan situasi" },
  { phase: 2, label: "Komentar Awal", desc: "Ekspresikan pendapatmu" },
  { phase: 3, label: "Analisis AI", desc: "Sistem mengklasifikasi" },
  { phase: 4, label: "Serangan Bot", desc: "Provokasi masuk!" },
  { phase: 5, label: "Peringatan", desc: "Kamu diserang!" },
  { phase: 6, label: "Balasan Final", desc: "Tunjukkan sikapmu" },
  { phase: 7, label: "Rapor Etika", desc: "Lihat nilaimu" },
];

const STATIC_TIP = "Kata-kata di internet memiliki dampak nyata pada kehidupan seseorang.";

export default function RightPanel({ scenarioTitle, currentPhase, username }: RightPanelProps) {
  const progressPercent = currentPhase ? Math.round((currentPhase / 7) * 100) : 0;

  return (
    <aside className="h-full flex flex-col border-l border-border bg-white overflow-y-auto">

      {/* Profile Summary */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">@{username.toLowerCase().replace(/\s+/g, "_")}</p>
            <Badge className="mt-1 text-[10px] px-2 py-0.5 h-auto rounded-md bg-indigo-50 text-indigo-700 border-indigo-100 font-semibold">
              Netizen Aktif
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Skenario", value: "1" },
            { label: "Selesai", value: "0" },
            { label: "Rata-rata", value: "-" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/60 rounded-xl py-2">
              <p className="text-sm font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Progress Tracker */}
      {currentPhase && scenarioTitle && (
        <>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Progres Simulasi</p>
              <p className="text-sm font-bold text-foreground truncate">{scenarioTitle}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Fase {currentPhase} dari 7</span>
                <span className="font-bold text-indigo-600">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 rounded-full [&>div]:bg-indigo-600" />
            </div>

            {/* Phase Steps */}
            <div className="space-y-2">
              {PHASES.map(({ phase, label, desc }) => {
                const isCompleted = currentPhase > phase;
                const isCurrent = currentPhase === phase;
                return (
                  <div
                    key={phase}
                    className={`flex items-start gap-2.5 rounded-xl p-2 transition-colors ${isCurrent ? "bg-indigo-50" : ""}`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold leading-none ${isCurrent ? "text-indigo-700" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Pillars */}
      <div className="p-5 space-y-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kriteria Penilaian</p>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Sila ke-2</p>
              <p className="text-[10px] text-muted-foreground">Kemanusiaan yang Adil dan Beradab</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-3.5 w-3.5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Sila ke-3</p>
              <p className="text-[10px] text-muted-foreground">Persatuan Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tips */}
      <div className="p-5">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">Tips Etika Digital</p>
            <p className="text-xs text-amber-800 leading-relaxed">{STATIC_TIP}</p>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Topik Viral</p>
        </div>
        {["#BapakVsMotor", "#EtikaDigital", "#Pancasila", "#StopKebencian"].map((tag) => (
          <div key={tag} className="py-1.5 border-b border-border last:border-0">
            <p className="text-xs font-bold text-indigo-600">{tag}</p>
            <p className="text-[10px] text-muted-foreground">Trending · Edukasi</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

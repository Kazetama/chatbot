"use client";

import { Card } from "@/components/ui/card";
import { Loader2, BrainCircuit } from "lucide-react";

interface ClassifyingLoaderProps {
  comment: string;
}

export default function ClassifyingLoader({ comment }: ClassifyingLoaderProps) {
  return (
    <Card className="rounded-2xl border-indigo-100 bg-indigo-50/50 shadow-sm p-5 animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <BrainCircuit className="h-5 w-5 text-indigo-600 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 text-indigo-500 animate-spin" />
            <p className="text-sm font-bold text-indigo-700">Sistem sedang menganalisis komentar Anda...</p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-xl px-3 py-2">
            <p className="text-xs text-muted-foreground italic">&ldquo;{comment}&rdquo;</p>
          </div>
          <div className="flex gap-2">
            {["Positif", "Negatif", "Sarkas", "Netral"].map((cls, i) => (
              <div
                key={cls}
                className="h-1.5 flex-1 rounded-full bg-indigo-200 overflow-hidden"
              >
                <div
                  className="h-full bg-indigo-500 rounded-full animate-pulse"
                  style={{ width: `${[70, 30, 50, 45][i]}%`, animationDelay: `${i * 0.15}s` }}
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-indigo-500 font-medium">
            Mengklasifikasikan: Positif · Negatif · Sarkas · Netral
          </p>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentClass } from "@/components/Sidebar";
import { ThumbsUp, ThumbsDown, Repeat2, Flag, Zap } from "lucide-react";

interface BotReplyCardProps {
  botText: string;
  sentimentClass: SentimentClass;
  userComment: string;
  username: string;
}

const SENTIMENT_META: Record<
  Exclude<SentimentClass, null>,
  { label: string; emoji: string; badgeClass: string }
> = {
  positive: { label: "Positif", emoji: "✅", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  negative: { label: "Negatif", emoji: "🔴", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
  sarcastic: { label: "Sarkas", emoji: "😏", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  neutral: { label: "Netral", emoji: "⚪", badgeClass: "bg-slate-50 text-slate-600 border-slate-200" },
};

export default function BotReplyCard({
  botText,
  sentimentClass,
  userComment,
  username,
}: BotReplyCardProps) {
  const meta = sentimentClass ? SENTIMENT_META[sentimentClass] : null;
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-3 animate-fade-up">
      {/* User's submitted comment (read-only recap) */}
      <Card className="rounded-2xl border-border bg-white shadow-sm p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-bold text-foreground">{username}</p>
              {meta && (
                <Badge variant="outline" className={`text-[10px] px-2 py-0 h-4 rounded-md font-semibold ${meta.badgeClass}`}>
                  {meta.emoji} Terklasifikasi: {meta.label}
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground/90 mt-1 leading-relaxed">&ldquo;{userComment}&rdquo;</p>
          </div>
        </div>
      </Card>

      {/* Bot Provocation Reply */}
      <Card className="rounded-2xl border-rose-200 bg-rose-50/60 shadow-sm overflow-hidden animate-flash-border">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-rose-500 to-red-500" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm flex-shrink-0">
              👾
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold text-foreground">@provocateur_bot</p>
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-rose-600 text-white border-0 font-bold flex items-center gap-0.5">
                  <Zap className="h-2.5 w-2.5" />
                  Membalas Anda
                </Badge>
                <span className="text-[10px] text-muted-foreground">baru saja</span>
              </div>
              <p className="text-sm text-foreground mt-2 leading-relaxed font-medium">{botText}</p>
              {/* Action row */}
              <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-rose-500 transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" /> 892
                </button>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-slate-600 transition-colors">
                  <ThumbsDown className="h-3.5 w-3.5" /> 41
                </button>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-indigo-500 transition-colors">
                  <Repeat2 className="h-3.5 w-3.5" /> 340
                </button>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-rose-500 ml-auto transition-colors">
                  <Flag className="h-3.5 w-3.5" /> Laporkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

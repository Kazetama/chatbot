"use client";

import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface FakeComment {
  avatar: string;
  name: string;
  text: string;
  time: string;
  likes: number;
  avatarColor: string;
}

const FAKE_COMMENTS: FakeComment[] = [
  { avatar: "AJ", name: "Andi Jatmika", text: "Ini udah keterlaluan! Gak ada rasa hormat sama sekali!", time: "1j", likes: 847, avatarColor: "from-rose-400 to-red-500" },
  { avatar: "SR", name: "Sari Rahmawati", text: "Harap cari tahu dulu kronologinya, jangan langsung nge-judge...", time: "45m", likes: 234, avatarColor: "from-sky-400 to-blue-500" },
  { avatar: "DK", name: "Dedi K.", text: "WKWKWK pahlawan kampung nih 💀 Gak ada habisnya", time: "32m", likes: 1204, avatarColor: "from-amber-400 to-orange-500" },
  { avatar: "RP", name: "Rizky Pratama", text: "Lapor polisi aja min, jangan main hakim sendiri ya", time: "28m", likes: 89, avatarColor: "from-emerald-400 to-teal-500" },
];

export default function FakeComments() {
  return (
    <Card className="rounded-2xl border-border shadow-sm bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60">
        <p className="text-sm font-bold text-foreground">Komentar Teratas</p>
        <p className="text-xs text-muted-foreground">{FAKE_COMMENTS.length} dari ribuan komentar</p>
      </div>
      <div className="divide-y divide-border/60">
        {FAKE_COMMENTS.map((c, i) => (
          <div key={i} className="flex gap-3 p-4">
            <div
              className={`h-8 w-8 rounded-full bg-gradient-to-br ${c.avatarColor} text-white text-[10px] font-extrabold flex-shrink-0 flex items-center justify-center shadow-sm`}
            >
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-bold text-foreground">{c.name}</p>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-xs text-foreground/90 mt-0.5 leading-relaxed">{c.text}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <button className="text-[10px] text-muted-foreground hover:text-rose-500 flex items-center gap-1 transition-colors">
                  <Heart className="h-3 w-3" /> {c.likes.toLocaleString()}
                </button>
                <button className="text-[10px] text-muted-foreground hover:text-indigo-500 transition-colors">
                  Balas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

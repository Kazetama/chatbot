"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle, Share2, Bookmark,
  MoreHorizontal, ThumbsUp
} from "lucide-react";

interface ScenarioFeedProps {
  platform: string;
  posterName: string;
  posterHandle: string;
  posterAvatar: string;
  postCaption: string;
  postImage: string;
  postTime: string;
  likes: string;
  shares: string;
  comments: string;
  difficulty: string;
  onScrollToComments: () => void;
}

export default function ScenarioFeed({
  platform,
  posterName,
  posterHandle,
  posterAvatar,
  postCaption,
  postImage,
  postTime,
  likes,
  shares,
  comments,
  difficulty,
  onScrollToComments,
}: ScenarioFeedProps) {
  const difficultyColor =
    difficulty === "Mudah"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : difficulty === "Sedang"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <Card className="rounded-2xl border-border shadow-sm overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-400 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-sm">
          {posterAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground">{posterName}</p>
            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-500 text-white border-0 rounded font-bold">✓</Badge>
            <Badge variant="outline" className={`text-[10px] h-4 px-1.5 rounded font-semibold ${difficultyColor}`}>
              {difficulty}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {posterHandle} · {postTime} · 📘 {platform}
          </p>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted ml-auto">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-foreground leading-relaxed">{postCaption}</p>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-100">
        <Image
          src={postImage}
          alt="Konten viral"
          width={640}
          height={360}
          className="w-full object-cover max-h-80 select-none"
          draggable={false}
        />
        {/* Recording badge overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          REC · 18:42
        </div>
        {/* Platform badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 px-2 py-1 rounded-lg shadow-sm">
          📘 {platform}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
        <span className="flex items-center gap-1">
          <span className="text-base">❤️😠😮</span>
          {likes} Reaksi
        </span>
        <div className="flex items-center gap-3">
          <span>{comments} Komentar</span>
          <span>·</span>
          <span>{shares} Dibagikan</span>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex items-center px-1 py-1">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-muted rounded-xl transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ThumbsUp className="h-4 w-4" />
          Suka
        </button>
        <button
          onClick={onScrollToComments}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-indigo-50 rounded-xl transition-colors text-xs font-semibold text-muted-foreground hover:text-indigo-600"
        >
          <MessageCircle className="h-4 w-4" />
          Komentar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-muted rounded-xl transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
          Bagikan
        </button>
        <button className="flex items-center justify-center p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

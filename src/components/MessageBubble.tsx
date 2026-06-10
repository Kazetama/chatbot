"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Message } from "@/components/Sidebar";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-6">
        <div className="bg-muted dark:bg-zinc-800/80 text-foreground text-sm rounded-3xl px-5 py-3 max-w-[70%] break-words shadow-sm">
          {message.content.split("\n").map((paragraph, pIdx) => (
            <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Assistant Message (Gemini style)
  return (
    <div className="flex flex-col w-full mb-8 items-start">
      {/* Sparkle Icon & Name */}
      <div className="flex items-center gap-2 mb-2.5 select-none">
        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
          <Sparkles className="h-3 w-3 fill-white" />
        </div>
        <span className="text-xs font-bold tracking-tight text-foreground/80">Kaze AI</span>
      </div>

      {/* Message Content (No Bubble Frame, Just Clean Typography) */}
      <div className="pl-8 text-sm leading-relaxed text-foreground/90 max-w-[90%] break-words">
        {message.content.split("\n").map((paragraph, pIdx) => (
          <p key={pIdx} className={pIdx > 0 ? "mt-3" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

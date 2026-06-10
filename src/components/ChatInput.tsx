"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="pb-8 pt-2 px-4 bg-transparent shrink-0">
      <div className="max-w-3xl mx-auto relative flex items-center bg-zinc-100 dark:bg-zinc-800/80 rounded-3xl border border-border px-4 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all shadow-sm">
        {/* Input Text Box */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanya Kaze Chat..."
          className="flex-1 bg-transparent border-0 py-2.5 text-sm focus:outline-none focus:ring-0 placeholder-muted-foreground min-w-0"
        />

        {/* Action Buttons (Right Aligned inside the box) */}
        <div className="flex items-center gap-1.5 pl-2">
          {/* Micro Icon Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Gunakan Suara"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            size="icon"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all hover:bg-primary/90 disabled:opacity-40 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-[10px] text-center text-muted-foreground mt-2.5">
        Kaze Chat dapat membuat kesalahan. Harap verifikasi info penting.
      </p>
    </footer>
  );
}

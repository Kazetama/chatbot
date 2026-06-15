"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface CommentInputProps {
  username: string;
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  replyToUsername?: string | null;
}

export default function CommentInput({
  username,
  value,
  onChange,
  onSend,
  placeholder = "Tulis komentarmu...",
  disabled = false,
  replyToUsername = null,
}: CommentInputProps) {
  const initials = username.slice(0, 2).toUpperCase();

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Card className="rounded-2xl border-border shadow-sm bg-white p-4">
      {replyToUsername && (
        <p className="text-[11px] text-indigo-600 font-semibold mb-2 px-1">
          ↩️ Membalas komentar dari <span className="font-black">{replyToUsername}</span>
        </p>
      )}
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-extrabold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-12 rounded-full border-border bg-slate-50 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 text-sm h-10"
            autoComplete="off"
          />
          <Button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 shadow-sm"
          >
            {disabled ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";

interface AttackNotificationProps {
  onDismiss: () => void;
}

export default function AttackNotification({ onDismiss }: AttackNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <>
      {/* Subtle red screen tint */}
      <div className="fixed inset-0 z-40 bg-rose-500/8 pointer-events-none animate-pulse" />

      {/* Toast notification */}
      <div className="fixed top-5 right-5 z-50 w-80 bg-white border border-rose-200 rounded-2xl shadow-xl shadow-rose-100/50 overflow-hidden animate-fade-up">
        <div className="h-1 bg-gradient-to-r from-rose-500 to-red-500" />
        <div className="p-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <Bell className="h-4 w-4 text-rose-600 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Komentar Anda Diserang!</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              @provocateur_bot membalas komentarmu dengan nada provokatif.
            </p>
          </div>
          <button
            onClick={() => { setVisible(false); onDismiss(); }}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {/* Auto-dismiss progress bar */}
        <div className="h-1 bg-rose-100">
          <div
            className="h-full bg-rose-400 rounded-full"
            style={{ animation: "shrink 2.5s linear forwards" }}
          />
        </div>
        <style>{`
          @keyframes shrink { from { width: 100% } to { width: 0% } }
        `}</style>
      </div>
    </>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Settings, MessageSquare, X } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

interface SidebarProps {
  threads: Thread[];
  activeThreadId: string;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onDeleteThread: (e: React.MouseEvent, id: string) => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export default function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  isSidebarOpen,
  onCloseSidebar,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            K
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Kaze Chat</h1>
            <p className="text-[10px] text-muted-foreground font-normal">AI Workspace</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseSidebar}
          className="md:hidden rounded-full h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Action Button */}
      <div className="p-4">
        <Button onClick={onNewThread} className="w-full justify-start gap-2 rounded-xl py-5" size="default">
          <Plus className="h-4 w-4" />
          <span>Percakapan Baru</span>
        </Button>
      </div>

      {/* Sidebar List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Riwayat Obrolan ({threads.length})
        </div>

        {threads.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            Belum ada percakapan
          </div>
        ) : (
          threads.map((t) => {
            const isActive = t.id === activeThreadId;
            return (
              <div
                key={t.id}
                onClick={() => onSelectThread(t.id)}
                className={`group flex items-center justify-between rounded-xl px-3 py-3 text-xs cursor-pointer select-none transition-colors ${
                  isActive
                    ? "bg-secondary text-secondary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="truncate">{t.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onDeleteThread(e, t.id)}
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive h-6 w-6 rounded-md flex-shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border p-4 bg-muted/20">
        <Button variant="ghost" className="w-full justify-start gap-2.5 rounded-xl py-4 hover:bg-muted">
          <Settings className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="text-xs">Pengaturan</span>
        </Button>
      </div>
    </aside>
  );
}

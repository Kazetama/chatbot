"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Sidebar, { Thread, Message } from "@/components/Sidebar";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import { Menu, Plus } from "lucide-react";

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      title: "Desain UI Chatbot",
      messages: [
        {
          id: "m1",
          role: "user",
          content: "Halo! Tolong buatkan desain UI untuk chatbot web yang modern.",
          timestamp: new Date(),
        },
        {
          id: "m2",
          role: "assistant",
          content:
            "Tentu! Desain UI chatbot web yang modern biasanya menggunakan layout dua kolom: **Sidebar** di sebelah kiri (untuk riwayat obrolan dan tombol Obrolan Baru) dan **Main Content** di sebelah kanan (sebagai area obrolan aktif).\n\nKita bisa menambahkan sentuhan *glassmorphism* (efek kaca transparan), mode gelap, serta tombol aksi cepat untuk menyalin kode atau membacakan teks suara.",
          timestamp: new Date(),
        },
      ],
    },
    {
      id: "2",
      title: "Optimasi Query SQL",
      messages: [],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("1");
  const [inputText, setInputText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handlers
  const handleNewThread = () => {
    const newId = `thread_${Date.now()}`;
    const newThread: Thread = {
      id: newId,
      title: `Obrolan Baru ${threads.length + 1}`,
      messages: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    setIsSidebarOpen(false);
  };

  const handleDeleteThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) {
      const remaining = threads.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        setActiveThreadId(remaining[0].id);
      } else {
        setActiveThreadId("");
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    // Find current active thread or create one if empty
    let targetId = activeThreadId;
    let updatedThreads = [...threads];

    if (!targetId) {
      const newId = `thread_${Date.now()}`;
      const newThread: Thread = {
        id: newId,
        title: inputText.length > 20 ? inputText.substring(0, 18) + "..." : inputText,
        messages: [userMsg],
      };
      updatedThreads = [newThread, ...updatedThreads];
      setThreads(updatedThreads);
      setActiveThreadId(newId);
      targetId = newId;
    } else {
      updatedThreads = threads.map((t) => {
        if (t.id === targetId) {
          // If first message in thread, rename the title to prompt
          const rename = t.messages.length === 0;
          return {
            ...t,
            title: rename ? (inputText.length > 20 ? inputText.substring(0, 18) + "..." : inputText) : t.title,
            messages: [...t.messages, userMsg],
          };
        }
        return t;
      });
      setThreads(updatedThreads);
    }

    setInputText("");

    // Simulate Assistant Response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `msg_bot_${Date.now()}`,
        role: "assistant",
        content: `Ini adalah respon otomatis untuk pertanyaan Anda: "${userMsg.content}". Saya siap membantu mengerjakan tugas koding, menyusun naskah tulisan, atau menganalisis data.`,
        timestamp: new Date(),
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetId ? { ...t, messages: [...t.messages, assistantMsg] } : t
        )
      );
    }, 800);
  };


  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const quickSuggestions = [
    "Jelaskan konsep OOP secara sederhana",
    "Bantu saya membuat kerangka karangan esai",
    "Bagaimana cara memformat tanggal di JavaScript?",
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Mobile Sidebar Trigger (Top Nav) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-border bg-card flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-sm tracking-tight">Kaze Chat</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNewThread} className="rounded-full">
          <Plus className="h-4.5 w-4.5" />
        </Button>
      </div>

      {/* Sidebar Component */}
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={(id) => {
          setActiveThreadId(id);
          setIsSidebarOpen(false);
        }}
        onNewThread={handleNewThread}
        onDeleteThread={handleDeleteThread}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-muted/10 pt-14 md:pt-0">
        {/* Main Content Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground">
            {activeThread ? `Model: Kaze AI (Simulated)` : "Mulai Obrolan Baru"}
          </span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-medium">Sistem Aktif</span>
          </div>
        </header>

        {/* Conversation Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {!activeThread || activeThread.messages.length === 0 ? (
            /* Welcome Landing Screen */
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center text-center space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-2xl mx-auto shadow-md">
                K
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Kaze Chat Workspace</h2>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Selamat datang di Kaze Chat! Silakan pilih saran perintah atau ketik pesan Anda untuk memulai percakapan baru.
                </p>
              </div>

              {/* Suggestions */}
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto pt-4 w-full">
                {quickSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(s);
                    }}
                    className="p-3 text-left border border-border bg-card hover:bg-accent rounded-xl text-xs font-medium transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Bubbles list */
            <div className="max-w-3xl mx-auto space-y-4">
              {activeThread.messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          )}
        </div>

        {/* Input Form Bar Footer */}
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSend}
        />
      </main>
    </div>
  );
}

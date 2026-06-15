"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flame, Shield, Users, ChevronRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const FEATURES = [
  { icon: Flame, label: "Simulasi War Comment", desc: "Hadapi provokasi nyata media sosial" },
  { icon: Shield, label: "Evaluasi Sila ke-2 & ke-3", desc: "Penilaian etika digital berbasis Pancasila" },
  { icon: Users, label: "AI Powered", desc: "Didukung teknologi Gemini AI" },
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    // Small delay for UX feel
    setTimeout(() => onLogin(name.trim()), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 shadow-2xl shadow-indigo-100/50 rounded-3xl overflow-hidden border border-border bg-white">

        {/* Left Panel – Branding */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 flex flex-col justify-between text-white hidden md:flex">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute top-1/2 right-10 h-20 w-20 rounded-full bg-white/10" />
          </div>

          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-xl px-3 py-1.5 w-fit">
              <Flame className="h-4 w-4 text-orange-300" />
              <span className="text-xs font-bold tracking-wide">War Comment Lab</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
              Simulator<br />Etika Digital<br />Indonesia 🇮🇩
            </h1>
            <p className="text-sm text-indigo-200 leading-relaxed max-w-xs">
              Uji kemampuanmu menghadapi konflik media sosial. Apakah kamu seorang{" "}
              <span className="font-bold text-white">Pancasialis</span> atau{" "}
              <span className="font-bold text-rose-300">Toxic Netizen</span>?
            </p>
          </div>

          <div className="relative space-y-3">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-indigo-200">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative text-[10px] text-indigo-300">
            © 2025 War Comment Lab · Edukasi Digital Berbasis Pancasila
          </p>
        </div>

        {/* Right Panel – Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-8">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base text-indigo-700">War Comment Lab</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Selamat Datang! 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              Masukkan namamu untuk mulai simulasi. Tidak perlu mendaftar — cukup nama panggilanmu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-semibold text-foreground">
                Nama Panggilan
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Contoh: Budi, Sari, Andi..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 text-sm rounded-xl border-border focus-visible:ring-indigo-500 focus-visible:border-indigo-400"
                autoComplete="off"
                autoFocus
                maxLength={30}
              />
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memuat...
                </>
              ) : (
                <>
                  Mulai Simulasi
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Skenario Tersedia</p>
            <div className="flex flex-wrap gap-2">
              {["Bapak vs Motor 🏍️", "Kebocoran Data 🔐", "CEO Kontroversial 💼"].map((s) => (
                <Badge key={s} variant="secondary" className="text-xs font-medium rounded-lg px-2.5 py-1 bg-indigo-50 text-indigo-700 border-indigo-100">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            Dengan melanjutkan, kamu menyetujui bahwa simulasi ini bersifat edukatif dan tidak merepresentasikan pandangan politik apapun.
          </p>
        </div>
      </div>
    </div>
  );
}

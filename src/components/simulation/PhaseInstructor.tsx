"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhaseInstructorProps {
  phase: number;
  title: string;
  description: string;
  icon: ReactNode;
  variant?: "info" | "warning" | "danger" | "success";
}

const VARIANTS = {
  info: "bg-indigo-50 border-indigo-200 text-indigo-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  danger: "bg-rose-50 border-rose-200 text-rose-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
};

const ICON_BG = {
  info: "bg-indigo-100 text-indigo-600",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-rose-100 text-rose-600",
  success: "bg-emerald-100 text-emerald-600",
};

const PHASE_BG = {
  info: "bg-indigo-600",
  warning: "bg-amber-500",
  danger: "bg-rose-600",
  success: "bg-emerald-600",
};

export default function PhaseInstructor({
  phase,
  title,
  description,
  icon,
  variant = "info",
}: PhaseInstructorProps) {
  return (
    <div className={cn("rounded-2xl border p-4 flex items-start gap-3 animate-fade-up", VARIANTS[variant])}>
      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", ICON_BG[variant])}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-[10px] font-black text-white px-2 py-0.5 rounded-md", PHASE_BG[variant])}>
            FASE {phase}
          </span>
          <p className="text-sm font-bold">{title}</p>
        </div>
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
      </div>
    </div>
  );
}

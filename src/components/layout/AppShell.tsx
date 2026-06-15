"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppShellProps {
  sidebar: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
  onToggleMobileSidebar: () => void;
  mobileTitle?: string;
}

export default function AppShell({
  sidebar,
  rightPanel,
  children,
  onToggleMobileSidebar,
  mobileTitle = "War Comment Lab",
}: AppShellProps) {
  return (
    <div className="h-screen w-screen bg-slate-50/50 flex overflow-hidden">

      {/* Left Sidebar – fixed width desktop, hidden on mobile */}
      <div className="hidden md:flex md:w-[260px] lg:w-[280px] flex-shrink-0 flex-col h-full">
        {sidebar}
      </div>

      {/* Main Center Feed */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Mobile Top Nav */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-white flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMobileSidebar}
            className="h-9 w-9 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-sm text-indigo-700">{mobileTitle}</span>
          <div className="w-9" />
        </div>

        {/* Center Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
            {children}
          </div>
        </div>
      </div>

      {/* Right Panel – fixed width desktop, hidden on smaller screens */}
      <div className="hidden lg:flex lg:w-[300px] xl:w-[320px] flex-shrink-0 flex-col h-full">
        {rightPanel}
      </div>
    </div>
  );
}

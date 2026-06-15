"use client";

import { useState, useCallback } from "react";
import LoginScreen from "@/components/auth/LoginScreen";
import AppShell from "@/components/layout/AppShell";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightPanel from "@/components/layout/RightPanel";
import SimulationOrchestrator, { SCENARIOS } from "@/components/simulation/SimulationOrchestrator";
import { SimulationSession, SimPhase } from "@/components/Sidebar";

const STORAGE_KEY = "kaze_war_v3";
const USERNAME_KEY = "kaze_username_v3";

export default function Home() {
  const [username, setUsername] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USERNAME_KEY);
  });
  const [sessions, setSessions] = useState<SimulationSession[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved) as SimulationSession[];
      return parsed.map((s) => ({ ...s, createdAt: new Date(s.createdAt) }));
    } catch {
      return [];
    }
  });
  const [activeSessionId, setActiveSessionId] = useState("");
  const [currentPhase, setCurrentPhase] = useState<SimPhase | null>(null);
  const [currentScenarioTitle, setCurrentScenarioTitle] = useState<string | undefined>();

  const handleLogin = (name: string) => {
    setUsername(name);
    localStorage.setItem(USERNAME_KEY, name);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem(USERNAME_KEY);
  };

  const handleSessionUpdate = useCallback((session: SimulationSession) => {
    setSessions((prev) => {
      const updated = [session, ...prev.filter((s) => s.id !== session.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setActiveSessionId(session.id);
  }, []);

  const handleNewSession = useCallback(() => {
    setActiveSessionId("");
    setCurrentPhase(null);
    setCurrentScenarioTitle(undefined);
  }, []);

  const handlePhaseChange = useCallback((phase: SimPhase | null, title?: string) => {
    setCurrentPhase(phase);
    if (title) setCurrentScenarioTitle(title);
  }, []);

  if (!username) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const sidebarScenarios = SCENARIOS.map((sc) => ({
    id: sc.id,
    shortTitle: sc.shortTitle,
    difficulty: sc.difficulty,
  }));

  return (
    <AppShell
      onToggleMobileSidebar={handleNewSession}
      mobileTitle="War Comment Lab"
      sidebar={
        <LeftSidebar
          username={username}
          scenarios={sidebarScenarios}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewSession={handleNewSession}
          onLogout={handleLogout}
        />
      }
      rightPanel={
        <RightPanel
          username={username}
          currentPhase={currentPhase}
          scenarioTitle={currentScenarioTitle}
        />
      }
    >
      <SimulationOrchestrator
        username={username}
        onSessionUpdate={handleSessionUpdate}
        onPhaseChange={handlePhaseChange}
      />
    </AppShell>
  );
}

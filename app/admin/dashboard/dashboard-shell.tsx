"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadsTable } from "./leads-table";
import { ProjectsEditor } from "./projects-editor";
import { ToolsEditor } from "./tools-editor";
import { TestimonialsEditor } from "./testimonials-editor";
import { GuidesEditor } from "./guides-editor";

const tabs = ["Leads", "Projects", "Tools", "Testimonials", "Guides"] as const;
type Tab = (typeof tabs)[number];

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<Tab>("Leads");
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(5, 5, 8, 0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold tracking-tight">Admin</h1>
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-colors duration-200"
                style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.08)" : "transparent",
                  color: activeTab === tab ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-white/20 text-xs font-mono hover:text-white/40 transition-colors"
          >
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="text-white/20 text-xs font-mono hover:text-white/40 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "Leads" && <LeadsTable />}
        {activeTab === "Projects" && <ProjectsEditor />}
        {activeTab === "Tools" && <ToolsEditor />}
        {activeTab === "Testimonials" && <TestimonialsEditor />}
        {activeTab === "Guides" && <GuidesEditor />}
      </div>
    </div>
  );
}

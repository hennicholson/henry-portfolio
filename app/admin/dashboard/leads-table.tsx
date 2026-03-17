"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  source: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => { setLeads(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(255,255,255,0.15)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/30 text-sm">No leads captured yet.</p>
        <p className="text-white/15 text-xs font-mono mt-2">
          Your voice agent will populate this table.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono tracking-wider uppercase text-white/40">
          Leads ({leads.length})
        </h2>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider uppercase text-white/20">
                Name
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider uppercase text-white/20">
                Email
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider uppercase text-white/20">
                Source
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider uppercase text-white/20">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="transition-colors"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3 text-sm text-white/60">
                  {lead.name || <span className="text-white/15">--</span>}
                </td>
                <td className="px-4 py-3 text-sm text-white/60 font-mono">
                  {lead.email || <span className="text-white/15">--</span>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
                  >
                    {lead.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-white/25 font-mono">
                  {new Date(lead.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

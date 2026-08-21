"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Clock3,
  Gauge,
  Smile,
  Target,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/portal-shell";
import { Avatar, Badge, Card } from "@/components/ui";
import { agents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";

const volumeTrend = [
  { day: "Mon", chats: 42, resolved: 31 },
  { day: "Tue", chats: 51, resolved: 38 },
  { day: "Wed", chats: 47, resolved: 40 },
  { day: "Thu", chats: 63, resolved: 49 },
  { day: "Fri", chats: 58, resolved: 52 },
  { day: "Sat", chats: 29, resolved: 24 },
  { day: "Sun", chats: 22, resolved: 19 },
];

const responseTrend = [
  { hour: "9a", frt: 5.2 },
  { hour: "10a", frt: 4.1 },
  { hour: "11a", frt: 3.8 },
  { hour: "12p", frt: 6.4 },
  { hour: "1p", frt: 4.9 },
  { hour: "2p", frt: 3.5 },
  { hour: "3p", frt: 4.0 },
];

const ranges = ["Today", "7 days", "30 days"] as const;

export function AnalyticsView() {
  const conversations = usePortalStore((state) => state.conversations);
  const settings = usePortalStore((state) => state.settings);
  const [range, setRange] = useState<(typeof ranges)[number]>("7 days");

  const metrics = useMemo(() => {
    const total = conversations.length;
    const pending = conversations.filter((c) => c.status === "Pending").length;
    const active = conversations.filter((c) =>
      ["Active", "Assigned", "Waiting for User", "Waiting for Agent"].includes(
        c.status,
      ),
    ).length;
    const resolved = conversations.filter((c) =>
      ["Resolved", "Closed"].includes(c.status),
    ).length;
    const urgent = conversations.filter((c) => c.priority === "Urgent").length;
    const withAgent = conversations.filter((c) => c.assignedAgent).length;
    const avgResponse =
      conversations.reduce(
        (sum, c) => sum + (c.firstResponseMinutes ?? 4.5),
        0,
      ) / Math.max(total, 1);
    const slaHit = Math.round(
      (conversations.filter(
        (c) =>
          (c.firstResponseMinutes ?? 99) <= settings.slaFirstResponseMinutes,
      ).length /
        Math.max(total, 1)) *
        100,
    );
    const csat = 4.6;
    const handoff =
      total > 0 ? Math.round((withAgent / total) * 1000) / 10 : 0;

    return {
      total,
      pending,
      active,
      resolved,
      urgent,
      avgResponse: avgResponse.toFixed(1),
      slaHit,
      csat,
      handoff,
    };
  }, [conversations, settings.slaFirstResponseMinutes]);

  const statusMix = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of conversations) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [conversations]);

  const priorityMix = useMemo(() => {
    const order = ["Urgent", "High", "Medium", "Low"] as const;
    return order.map((name) => ({
      name,
      value: conversations.filter((c) => c.priority === name).length,
    }));
  }, [conversations]);

  const agentRows = useMemo(() => {
    return agents.map((agent, index) => {
      const owned = conversations.filter(
        (c) => c.assignedAgent === agent.name,
      ).length;
      return {
        ...agent,
        owned,
        resolved: Math.max(owned - 1, 0) + (index === 0 ? 2 : 1),
        csat: (4.8 - index * 0.15).toFixed(1),
        frt: `${(3.2 + index * 0.8).toFixed(1)}m`,
      };
    });
  }, [conversations]);

  const statusColors = [
    "#013f92",
    "#0254b3",
    "#38bdf8",
    "#94a3b8",
    "#c7d66d",
    "#f59e0b",
    "#ef4444",
  ];

  const kpis = [
    {
      label: "Conversation volume",
      value: String(metrics.total),
      hint: `${metrics.active} active · ${metrics.pending} waiting`,
      icon: Users,
      tone: "bg-blue-50 text-[#013f92]",
    },
    {
      label: "First response time",
      value: `${metrics.avgResponse}m`,
      hint: `SLA target ${settings.slaFirstResponseMinutes}m`,
      icon: Timer,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "SLA compliance",
      value: `${metrics.slaHit}%`,
      hint: "First-response within target",
      icon: Target,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "CSAT score",
      value: metrics.csat.toFixed(1),
      hint: "Based on resolved chats",
      icon: Smile,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Resolved",
      value: String(metrics.resolved),
      hint: `${metrics.handoff}% assigned handoff`,
      icon: Gauge,
      tone: "bg-[#f3f6c9] text-[#52620d]",
    },
    {
      label: "Urgent backlog",
      value: String(metrics.urgent),
      hint: "Needs immediate attention",
      icon: Clock3,
      tone: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow="Operations"
        title="Analytics"
        description="Track queue health, response speed, SLA, and agent performance — the metrics support leaders review weekly."
        action={
          <div className="flex rounded-lg bg-[#eef2f7] p-1">
            {ranges.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={cn(
                  "h-8 cursor-pointer rounded-md px-3 text-[12px] font-semibold transition",
                  range === item
                    ? "bg-white text-[#0a275f] shadow-sm"
                    : "text-slate-500 hover:text-[#0a275f]",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map(({ label, value, hint, icon: Icon, tone }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <span className={cn("grid size-9 place-items-center rounded-xl", tone)}>
                <Icon size={17} />
              </span>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-[#0a275f]">
              {value}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">{hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-[#0a275f]">
                Volume & resolution
              </h2>
              <p className="mt-0.5 text-[12px] text-slate-400">
                New chats vs completed · {range}
              </p>
            </div>
            <div className="flex gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-[#013f92]">
                <span className="size-2 rounded-full bg-[#013f92]" /> Incoming
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500" /> Resolved
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeTrend} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eef5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2eaf3",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="chats" fill="#013f92" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-bold text-[#0a275f]">Queue by status</h2>
          <p className="mt-0.5 text-[12px] text-slate-400">Live mix from current portal data</p>
          <div className="mt-2 flex h-56 items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {statusMix.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2eaf3",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusMix.map((item, index) => (
              <Badge key={item.name} tone="neutral" className="gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: statusColors[index % statusColors.length] }}
                />
                {item.name} · {item.value}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Card className="p-5">
          <h2 className="text-[15px] font-bold text-[#0a275f]">
            First response trend
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-400">
            Average minutes to first agent reply
          </p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eef5" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2eaf3",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="frt"
                  stroke="#0254b3"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#013f92" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[15px] font-bold text-[#0a275f]">Priority load</h2>
          <p className="mt-0.5 text-[12px] text-slate-400">
            Where pressure sits in the queue
          </p>
          <div className="mt-4 space-y-3">
            {priorityMix.map((item) => {
              const max = Math.max(...priorityMix.map((p) => p.value), 1);
              const pct = Math.round((item.value / max) * 100);
              const color =
                item.name === "Urgent"
                  ? "bg-red-500"
                  : item.name === "High"
                    ? "bg-amber-500"
                    : item.name === "Medium"
                      ? "bg-[#0254b3]"
                      : "bg-slate-300";
              return (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#0a275f]">{item.name}</span>
                    <span className="text-slate-400">{item.value} chats</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#eef2f7]">
                    <div
                      className={cn("h-full rounded-full", color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-5 overflow-hidden p-0">
        <div className="border-b border-[#e8eef5] px-5 py-4">
          <h2 className="text-[15px] font-bold text-[#0a275f]">
            Agent performance
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-400">
            Workload, speed, and satisfaction by teammate
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-[#f7f9fc] text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
              <tr>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Availability</th>
                <th className="px-5 py-3">Open</th>
                <th className="px-5 py-3">Resolved</th>
                <th className="px-5 py-3">FRT</th>
                <th className="px-5 py-3">CSAT</th>
              </tr>
            </thead>
            <tbody>
              {agentRows.map((agent) => (
                <tr key={agent.id} className="border-t border-[#eef2f7]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={agent.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[#0a275f]">{agent.name}</p>
                        <p className="text-[11px] text-slate-400">{agent.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      tone={
                        agent.availability === "Online"
                          ? "green"
                          : agent.availability === "Away"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      {agent.availability}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#0a275f]">
                    {agent.owned}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#0a275f]">
                    {agent.resolved}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{agent.frt}</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-600">
                    {agent.csat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

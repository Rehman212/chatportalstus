"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  Inbox,
  MessageCircle,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/portal-shell";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";

const chartData = [
  { time: "9 AM", new: 8, completed: 3 },
  { time: "10 AM", new: 12, completed: 7 },
  { time: "11 AM", new: 10, completed: 9 },
  { time: "12 PM", new: 17, completed: 11 },
  { time: "1 PM", new: 14, completed: 13 },
  { time: "2 PM", new: 20, completed: 15 },
  { time: "3 PM", new: 16, completed: 18 },
];

export function DashboardView() {
  const conversations = usePortalStore((state) => state.conversations);
  const pending = conversations.filter((item) => item.status === "Pending");
  const active = conversations.filter((item) =>
    ["Active", "Assigned", "Waiting for User", "Waiting for Agent"].includes(
      item.status,
    ),
  );
  const resolved = conversations.filter((item) =>
    ["Resolved", "Closed"].includes(item.status),
  );
  const assigned = conversations.filter(
    (item) => item.assignedAgent === "Ayesha Khan",
  );
  const stats = [
    { label: "Total conversations", value: conversations.length, icon: MessageCircle, color: "bg-blue-50 text-primary" },
    { label: "Active chats", value: active.length, icon: CircleDot, color: "bg-green-50 text-green-700" },
    { label: "Pending requests", value: pending.length, icon: Inbox, color: "bg-amber-50 text-amber-700" },
    { label: "Assigned to me", value: assigned.length, icon: UserCheck, color: "bg-violet-50 text-violet-700" },
    { label: "Avg. response", value: "4.3m", icon: Clock3, color: "bg-cyan-50 text-cyan-700" },
    { label: "Completed", value: resolved.length, icon: CheckCircle2, color: "bg-[#f1f5d4] text-[#59650f]" },
  ];

  return (
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Wednesday, 19 August"
        title="Good morning, Ayesha"
        description="Here’s what’s happening across the STUS support queue today."
        action={
          <Link href="/chats/live">
            <Button>
              Open live chats <ArrowRight size={17} />
            </Button>
          </Link>
        }
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <span className={`grid size-10 place-items-center rounded-xl ${color}`}>
                <Icon size={19} />
              </span>
              <Badge tone="green">
                <TrendingUp size={11} className="mr-1" /> 8%
              </Badge>
            </div>
            <p className="mt-5 text-2xl font-black tracking-tight text-stus-dark">
              {value}
            </p>
            <p className="mt-1 text-xs font-bold text-stus-muted">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.8fr)]">
        <Card className="min-w-0 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-stus-dark">Today’s chat activity</h2>
              <p className="mt-1 text-sm text-stus-muted">New and completed conversations by hour</p>
            </div>
            <Badge tone="blue">Live overview</Badge>
          </div>
          <div className="mt-6 h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -22, right: 4 }}>
                <defs>
                  <linearGradient id="newChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#013f92" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#013f92" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e7eef4" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#d9e5ef", fontSize: 12 }} />
                <Area type="monotone" dataKey="new" name="New chats" stroke="#013f92" strokeWidth={3} fill="url(#newChats)" />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#16a34a" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 border-t border-stus-border pt-4 text-xs font-bold text-stus-muted">
            <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-primary" /> New chats</span>
            <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-green-500" /> Completed</span>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-stus-border p-5">
            <div>
              <h2 className="text-lg font-black text-stus-dark">Recent requests</h2>
              <p className="mt-1 text-xs text-stus-muted">{pending.length} waiting for support</p>
            </div>
            <Link href="/chats/requests" className="text-xs font-bold text-primary hover:underline">
              View queue
            </Link>
          </div>
          <div className="divide-y divide-stus-border">
            {pending.slice(0, 4).map((conversation) => (
              <Link
                href={`/chats/live/${conversation.id}`}
                key={conversation.id}
                className="flex items-center gap-3 p-4 transition hover:bg-blue-50/50"
              >
                <Avatar name={conversation.customer.name} size="sm" online={conversation.customer.online} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-extrabold">{conversation.customer.name}</p>
                    <Badge tone={conversation.priority === "Urgent" ? "red" : "amber"}>{conversation.priority}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-stus-muted">{conversation.reason}</p>
                </div>
                <time className="text-[11px] text-stus-muted">{formatTime(conversation.requestedAt)}</time>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-stus-border p-5">
            <h2 className="text-lg font-black text-stus-dark">My active conversations</h2>
            <Badge tone="green">{active.length} active</Badge>
          </div>
          <div className="grid divide-y divide-stus-border md:grid-cols-2 md:divide-x md:divide-y-0">
            {assigned.slice(0, 2).map((conversation) => (
              <Link key={conversation.id} href={`/chats/live/${conversation.id}`} className="flex items-center gap-4 p-5 hover:bg-blue-50/50">
                <Avatar name={conversation.customer.name} online={conversation.customer.online} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{conversation.customer.name}</p>
                  <p className="mt-1 truncate text-xs text-stus-muted">{conversation.reason}</p>
                  <Badge className="mt-2" tone="blue">{conversation.status}</Badge>
                </div>
                <ArrowRight size={17} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-[#eef3cf] to-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-white text-[#647214] shadow-sm"><TrendingUp size={21} /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#69731e]">Handoff rate</p>
              <p className="mt-1 text-2xl font-black text-stus-dark">24.8%</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stus-muted">Down 3.2% from last week. The chatbot resolved more routine questions before handoff.</p>
        </Card>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/portal-shell";
import { Avatar, Badge, Button, Card, EmptyState, Input } from "@/components/ui";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";

export function HistoryView() {
  const conversations = usePortalStore((state) => state.conversations);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("This Week");
  const items = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${conversation.id} ${conversation.customer.name} ${conversation.customer.company} ${conversation.assignedAgent}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [conversations, query],
  );
  const completed = conversations.filter((item) =>
    ["Resolved", "Closed"].includes(item.status),
  ).length;

  return (
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Conversation archive"
        title="Chat history"
        description="Review transcripts, chatbot context and assignment history across your support workspace."
        action={<Button variant="secondary" disabled><Download size={16} /> Export in phase two</Button>}
      />
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total this week", value: conversations.length, icon: MessageCircle, tone: "bg-blue-50 text-primary" },
          { label: "Completed", value: completed, icon: CheckCircle2, tone: "bg-green-50 text-green-700" },
          { label: "Avg. first response", value: "4.3m", icon: Clock3, tone: "bg-violet-50 text-violet-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="flex items-center gap-4 p-5">
            <span className={cn("grid size-11 place-items-center rounded-xl", tone)}><Icon size={20} /></span>
            <div><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-stus-muted">{label}</p></div>
          </Card>
        ))}
      </div>
      <Card className="mt-5 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stus-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
            <Input className="pl-10" placeholder="Search history" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <label className="relative">
            <span className="sr-only">Date period</span>
            <CalendarDays className="absolute left-3 top-3.5 text-stus-muted" size={16} />
            <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-11 rounded-xl border border-stus-border bg-white pl-9 pr-4 text-sm font-bold">
              <option>Today</option><option>Yesterday</option><option>This Week</option><option>Last Week</option>
            </select>
          </label>
        </div>
        {items.length === 0 ? (
          <EmptyState title="No history found" description="Try a different customer, company or conversation ID." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-stus-muted">
                <tr>
                  {["Conversation", "Customer", "Type", "Agent", "Started", "Response", "Status", ""].map((label) => (
                    <th key={label} className="px-5 py-3 font-extrabold">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stus-border">
                {items.map((conversation) => (
                  <tr key={conversation.id} className="hover:bg-blue-50/40">
                    <td className="px-5 py-4 text-sm font-extrabold text-primary">{conversation.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={conversation.customer.name} size="sm" />
                        <div><p className="text-sm font-bold">{conversation.customer.name}</p><p className="mt-1 text-xs text-stus-muted">{conversation.customer.company}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><Badge tone={conversation.customer.type === "Buyer" ? "blue" : "purple"}>{conversation.customer.type}</Badge></td>
                    <td className="px-5 py-4 text-sm text-stus-muted">{conversation.assignedAgent || "Unassigned"}</td>
                    <td className="px-5 py-4 text-sm text-stus-muted">{formatDate(conversation.requestedAt)}</td>
                    <td className="px-5 py-4 text-sm font-bold">{conversation.firstResponseMinutes ? `${conversation.firstResponseMinutes}m` : "—"}</td>
                    <td className="px-5 py-4"><Badge tone={["Resolved", "Closed"].includes(conversation.status) ? "green" : "blue"}>{conversation.status}</Badge></td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/chats/history/${conversation.id}`}><Button variant="ghost" size="sm">View <ArrowRight size={15} /></Button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export function HistoryDetail({ conversationId }: { conversationId: string }) {
  const conversation = usePortalStore((state) =>
    state.conversations.find((item) => item.id === conversationId),
  );
  if (!conversation) {
    return (
      <div className="p-8">
        <EmptyState title="Conversation not found" description="This transcript may have been removed or the ID is invalid." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <Link href="/chats/history" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
        <ArrowLeft size={17} /> Back to history
      </Link>
      <PageHeader
        eyebrow={conversation.id}
        title={conversation.customer.name}
        description={`${conversation.reason} · Started ${formatDate(conversation.requestedAt)}`}
        action={<Badge tone={["Resolved", "Closed"].includes(conversation.status) ? "green" : "blue"}>{conversation.status}</Badge>}
      />
      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_340px]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-stus-border p-5">
            <div><h2 className="font-black">Full transcript</h2><p className="mt-1 text-xs text-stus-muted">{conversation.messages.length} events and messages</p></div>
            <Badge tone="neutral">Read only</Badge>
          </div>
          <div className="bg-slate-50/70 p-4 sm:p-6">
            {conversation.messages.map((message) => {
              if (message.kind === "system") return (
                <div key={message.id} className="my-5 flex items-center gap-3 text-[10px] font-bold text-stus-muted">
                  <span className="h-px flex-1 bg-stus-border" /><Bot size={14} /> {message.body}<span className="h-px flex-1 bg-stus-border" />
                </div>
              );
              if (message.kind === "note") return (
                <div key={message.id} className="my-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
                  <p className="mb-1 flex items-center gap-2 text-xs font-black text-amber-800"><ShieldCheck size={14} /> Internal note</p>{message.body}
                </div>
              );
              const own = message.kind === "agent";
              return (
                <div key={message.id} className={cn("mb-4 flex gap-2", own && "justify-end")}>
                  {!own && <Avatar name={message.sender} size="sm" />}
                  <div className={cn("max-w-[78%]", own && "text-right")}>
                    <p className="mb-1 text-[10px] font-bold text-stus-muted">{message.sender} · {formatTime(message.createdAt)}</p>
                    <div className={cn("rounded-2xl px-4 py-3 text-left text-sm leading-6 shadow-sm", own ? "rounded-br-md bg-primary text-white" : "rounded-bl-md border border-stus-border bg-white")}>{message.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3"><Avatar name={conversation.customer.name} size="lg" /><div><h2 className="font-black">{conversation.customer.name}</h2><p className="mt-1 text-xs text-stus-muted">{conversation.customer.company}</p></div></div>
            <dl className="mt-5 space-y-3 text-sm">
              <div><dt className="text-xs text-stus-muted">Type</dt><dd className="mt-1 font-bold">{conversation.customer.type}</dd></div>
              <div><dt className="text-xs text-stus-muted">Email</dt><dd className="mt-1 break-all font-bold">{conversation.customer.email}</dd></div>
              <div><dt className="text-xs text-stus-muted">Assigned agent</dt><dd className="mt-1 font-bold">{conversation.assignedAgent || "Unassigned"}</dd></div>
              <div><dt className="text-xs text-stus-muted">First response</dt><dd className="mt-1 font-bold">{conversation.firstResponseMinutes ? `${conversation.firstResponseMinutes} minutes` : "Not recorded"}</dd></div>
            </dl>
          </Card>
          <Card className="p-5">
            <h3 className="flex items-center gap-2 font-black"><Bot size={17} className="text-primary" /> Chatbot context</h3>
            <div className="mt-4 space-y-3">
              {conversation.chatbotContext.map((item) => <div key={item.question}><p className="text-xs text-stus-muted">{item.question}</p><p className="mt-1 text-sm font-bold">{item.answer}</p></div>)}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="flex items-center gap-2 font-black"><FileText size={17} className="text-primary" /> Timeline</h3>
            <div className="mt-4 border-l-2 border-stus-border pl-4 text-xs text-stus-muted">
              <p className="font-bold text-stus-dark">Conversation requested</p><p className="mt-1">{formatDate(conversation.requestedAt)} at {formatTime(conversation.requestedAt)}</p>
              <p className="mt-5 font-bold text-stus-dark">Current status</p><p className="mt-1">{conversation.status}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

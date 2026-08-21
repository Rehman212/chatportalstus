"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Inbox,
  Search,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/portal-shell";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
} from "@/components/ui";
import { agents } from "@/lib/mock-data";
import { cn, formatTime, relativeTime } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";
import type { Conversation, Priority, UserType } from "@/types";

const priorityTone = (priority: Priority) =>
  priority === "Urgent"
    ? "red"
    : priority === "High"
      ? "amber"
      : priority === "Medium"
        ? "blue"
        : "neutral";

const priorityBar = (priority: Priority) =>
  priority === "Urgent"
    ? "bg-red-500"
    : priority === "High"
      ? "bg-amber-500"
      : priority === "Medium"
        ? "bg-[#0254b3]"
        : "bg-slate-300";

function PrioritySelect({
  value,
  onChange,
  id,
}: {
  value: Priority;
  onChange: (value: Priority) => void;
  id: string;
}) {
  return (
    <label className="relative inline-flex">
      <span className="sr-only">Priority for {id}</span>
      <span
        className={cn(
          "pointer-events-none absolute left-2.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full",
          priorityBar(value),
        )}
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Priority)}
        className="h-8 cursor-pointer appearance-none rounded-md border border-[#e2eaf3] bg-white py-0 pl-6 pr-7 text-[11px] font-semibold text-[#0a275f] outline-none hover:border-[#b8c9dc] focus:border-[#013f92]/35 focus:ring-2 focus:ring-[#013f92]/10"
      >
        <option>Urgent</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </label>
  );
}

export function QueueView({
  mode,
}: {
  mode: "requests" | "assigned" | "unassigned";
}) {
  const conversations = usePortalStore((state) => state.conversations);
  const accept = usePortalStore((state) => state.acceptConversation);
  const reject = usePortalStore((state) => state.rejectConversation);
  const assign = usePortalStore((state) => state.assignConversation);
  const setPriority = usePortalStore((state) => state.setPriority);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | UserType>("All");
  const [priority, setPriorityFilter] = useState<"All" | Priority>("All");
  const [preview, setPreview] = useState<Conversation | null>(null);

  const base = conversations.filter((conversation) => {
    if (mode === "requests") return conversation.status === "Pending";
    if (mode === "assigned")
      return (
        conversation.assignedAgent === "Ayesha Khan" &&
        !["Closed", "Resolved", "Rejected"].includes(conversation.status)
      );
    return (
      !conversation.assignedAgent &&
      !["Closed", "Resolved", "Rejected"].includes(conversation.status)
    );
  });

  const filtered = useMemo(
    () =>
      base
        .filter((conversation) => {
          const matchesQuery =
            `${conversation.id} ${conversation.customer.name} ${conversation.customer.email} ${conversation.customer.company}`
              .toLowerCase()
              .includes(query.toLowerCase());
          return (
            matchesQuery &&
            (type === "All" || conversation.customer.type === type) &&
            (priority === "All" || conversation.priority === priority)
          );
        })
        .sort((a, b) => {
          const rank = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
          const byPriority = rank[a.priority] - rank[b.priority];
          if (byPriority !== 0) return byPriority;
          return (
            new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
          );
        }),
    [base, priority, query, type],
  );

  const stats = useMemo(() => {
    const urgent = base.filter((c) => c.priority === "Urgent").length;
    const high = base.filter((c) => c.priority === "High").length;
    const buyers = base.filter((c) => c.customer.type === "Buyer").length;
    const suppliers = base.filter((c) => c.customer.type === "Supplier").length;
    return { urgent, high, buyers, suppliers, total: base.length };
  }, [base]);

  const copy = {
    requests: {
      eyebrow: "Incoming queue",
      title: "Chat requests",
      description:
        "Triage new chatbot handoffs by urgency, review context, then accept or assign to the right agent.",
    },
    assigned: {
      eyebrow: "My workspace",
      title: "Assigned chats",
      description:
        "Conversations currently owned by you across active and waiting states.",
    },
    unassigned: {
      eyebrow: "Team queue",
      title: "Unassigned chats",
      description: "Open conversations that still need an owner before work can continue.",
    },
  }[mode];

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
      <PageHeader
        {...copy}
        action={
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-[12px] font-bold text-[#013f92]">
              {filtered.length} showing
            </span>
            <span className="hidden rounded-full bg-[#f1f5f9] px-3 py-1.5 text-[12px] font-semibold text-slate-500 sm:inline">
              {stats.total} in queue
            </span>
          </div>
        }
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "In this queue",
            value: stats.total,
            icon: Inbox,
            tone: "bg-blue-50 text-[#013f92]",
          },
          {
            label: "Urgent",
            value: stats.urgent,
            icon: Zap,
            tone: "bg-red-50 text-red-600",
          },
          {
            label: "High priority",
            value: stats.high,
            icon: Clock3,
            tone: "bg-amber-50 text-amber-700",
          },
          {
            label: "Buyers / Suppliers",
            value: `${stats.buyers} / ${stats.suppliers}`,
            icon: Users,
            tone: "bg-violet-50 text-violet-700",
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="flex items-center gap-3 p-4">
            <span className={cn("grid size-10 place-items-center rounded-xl", tone)}>
              <Icon size={18} />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                {label}
              </p>
              <p className="mt-0.5 text-xl font-black tracking-tight text-[#0a275f]">
                {value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-5 overflow-hidden border-[#e6edf5] shadow-[0_8px_30px_rgba(15,35,70,.04)]">
        <div className="flex flex-col gap-3 border-b border-[#eef2f7] bg-[#fafbfd] p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, company or conversation ID"
              aria-label="Search queue"
              className="h-10 w-full rounded-lg border border-[#e2eaf3] bg-white pl-10 pr-3 text-[13px] text-[#0a275f] outline-none transition placeholder:text-slate-400 focus:border-[#013f92]/35 focus:ring-2 focus:ring-[#013f92]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg bg-white p-1 ring-1 ring-[#e2eaf3]">
              {(["All", "Buyer", "Supplier"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={cn(
                    "h-8 cursor-pointer rounded-md px-3 text-[11px] font-semibold transition",
                    type === item
                      ? "bg-[#0a275f] text-white"
                      : "text-slate-500 hover:text-[#0a275f]",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex rounded-lg bg-white p-1 ring-1 ring-[#e2eaf3]">
              {(["All", "Urgent", "High", "Medium", "Low"] as const).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPriorityFilter(item)}
                    className={cn(
                      "h-8 cursor-pointer rounded-md px-2.5 text-[11px] font-semibold transition",
                      priority === item
                        ? "bg-[#0a275f] text-white"
                        : "text-slate-500 hover:text-[#0a275f]",
                    )}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No conversations found"
            description="Try adjusting your search or filters. New requests will appear here automatically."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1080px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#eef2f7] bg-white text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Request</th>
                    <th className="px-5 py-3.5">Waiting</th>
                    <th className="px-5 py-3.5">Priority</th>
                    <th className="px-5 py-3.5">Status</th>
                    {mode !== "requests" && (
                      <th className="px-5 py-3.5">Owner</th>
                    )}
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((conversation) => (
                    <tr
                      key={conversation.id}
                      className="group border-b border-[#f0f4f8] transition hover:bg-[#f7faff]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "h-10 w-1 shrink-0 rounded-full",
                              priorityBar(conversation.priority),
                            )}
                          />
                          <Avatar
                            name={conversation.customer.name}
                            online={conversation.customer.online}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-[#0a275f]">
                              {conversation.customer.name}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-slate-400">
                              {conversation.customer.company}
                              <span className="mx-1">·</span>
                              {conversation.customer.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[280px] px-5 py-4">
                        <p className="truncate text-[13px] font-semibold text-[#152a45]">
                          {conversation.reason}
                        </p>
                        <p className="mt-1 font-mono text-[11px] text-slate-400">
                          {conversation.id}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold",
                            conversation.priority === "Urgent"
                              ? "bg-red-50 text-red-600"
                              : "bg-[#f1f5f9] text-slate-500",
                          )}
                        >
                          <Clock3 size={13} />
                          {relativeTime(conversation.requestedAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <PrioritySelect
                          id={conversation.id}
                          value={conversation.priority}
                          onChange={(value) =>
                            setPriority(conversation.id, value)
                          }
                        />
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          tone={
                            conversation.status === "Pending"
                              ? "amber"
                              : conversation.status === "Active"
                                ? "green"
                                : "blue"
                          }
                        >
                          {conversation.status}
                        </Badge>
                      </td>
                      {mode !== "requests" && (
                        <td className="px-5 py-4">
                          {conversation.assignedAgent ? (
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={conversation.assignedAgent}
                                size="sm"
                              />
                              <span className="text-[12px] font-semibold text-[#0a275f]">
                                {conversation.assignedAgent}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] font-medium text-slate-400">
                              —
                            </span>
                          )}
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setPreview(conversation)}
                            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[#e2eaf3] bg-white px-2.5 text-[11px] font-semibold text-[#0a275f] transition hover:bg-[#f7f9fc]"
                          >
                            <Eye size={14} /> Preview
                          </button>
                          {mode === "requests" ? (
                            <button
                              type="button"
                              onClick={() => accept(conversation.id)}
                              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-[#013f92] px-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0254b3]"
                            >
                              <Check size={14} /> Accept
                            </button>
                          ) : (
                            <Link href={`/chats/live/${conversation.id}`}>
                              <span className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-[#013f92] px-2.5 text-[11px] font-semibold text-white transition hover:bg-[#0254b3]">
                                Open <ArrowRight size={14} />
                              </span>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#eef2f7] lg:hidden">
              {filtered.map((conversation) => (
                <article key={conversation.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1 h-10 w-1 shrink-0 rounded-full",
                        priorityBar(conversation.priority),
                      )}
                    />
                    <Avatar
                      name={conversation.customer.name}
                      online={conversation.customer.online}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[13px] font-bold text-[#0a275f]">
                          {conversation.customer.name}
                        </h3>
                        <Badge tone={priorityTone(conversation.priority)}>
                          {conversation.priority}
                        </Badge>
                        <Badge tone="blue">{conversation.status}</Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {conversation.customer.company} ·{" "}
                        {conversation.customer.type}
                      </p>
                      <p className="mt-2.5 text-[13px] font-semibold text-[#152a45]">
                        {conversation.reason}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {conversation.id} · {relativeTime(conversation.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3.5 flex gap-2 pl-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreview(conversation)}
                    >
                      Preview
                    </Button>
                    {mode === "requests" ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => accept(conversation.id)}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Link
                        href={`/chats/live/${conversation.id}`}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full">
                          Open chat
                        </Button>
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>

      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title="Conversation preview"
      >
        {preview && (
          <div>
            <div className="flex items-start gap-3 rounded-xl border border-[#e8eef5] bg-[#fafbfd] p-4">
              <Avatar
                name={preview.customer.name}
                size="lg"
                online={preview.customer.online}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-[#0a275f]">
                    {preview.customer.name}
                  </h3>
                  <Badge tone={priorityTone(preview.priority)}>
                    {preview.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-[12px] text-slate-500">
                  {preview.customer.company} · {preview.customer.type}
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  {preview.id} · {formatTime(preview.requestedAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#dce8f6] bg-[#f3f8ff] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#013f92]">
                Current request
              </p>
              <p className="mt-1.5 text-[14px] font-semibold text-[#0a275f]">
                {preview.reason}
              </p>
              <p className="mt-1 text-[12px] text-slate-500">{preview.product}</p>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2">
                <Bot size={14} className="text-[#013f92]" />
                <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  Chatbot context
                </h4>
              </div>
              <div className="space-y-2">
                {preview.chatbotContext.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-lg border border-[#e8eef5] bg-white px-3 py-2.5"
                  >
                    <p className="text-[11px] text-slate-400">{item.question}</p>
                    <p className="mt-1 text-[13px] font-semibold text-[#0a275f]">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {mode === "requests" && (
              <div className="mt-4">
                <p className="mb-2 text-[12px] font-semibold text-slate-500">
                  Or transfer to another agent
                </p>
                <div className="flex flex-wrap gap-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        assign(preview.id, agent.name);
                        setPreview(null);
                      }}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e2eaf3] bg-white py-1.5 pl-1.5 pr-3 text-[11px] font-semibold text-[#0a275f] hover:bg-[#f7f9fc]"
                    >
                      <Avatar name={agent.name} size="sm" />
                      {agent.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {mode === "requests" && (
                <>
                  <Button
                    onClick={() => {
                      accept(preview.id);
                      setPreview(null);
                    }}
                  >
                    <Check size={16} /> Accept chat
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      reject(preview.id);
                      setPreview(null);
                    }}
                  >
                    <X size={16} /> Reject
                  </Button>
                </>
              )}
              {!preview.assignedAgent && mode !== "requests" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    assign(preview.id, "Ayesha Khan");
                    setPreview(null);
                  }}
                >
                  <UserPlus size={16} /> Assign to me
                </Button>
              )}
              <Link href={`/chats/live/${preview.id}`}>
                <Button variant="secondary">Open conversation</Button>
              </Link>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Filter,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/portal-shell";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  Input,
} from "@/components/ui";
import { formatTime, relativeTime } from "@/lib/utils";
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
      base.filter((conversation) => {
        const matchesQuery = `${conversation.id} ${conversation.customer.name} ${conversation.customer.email} ${conversation.customer.company}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (type === "All" || conversation.customer.type === type) &&
          (priority === "All" || conversation.priority === priority)
        );
      }),
    [base, priority, query, type],
  );
  const copy = {
    requests: {
      eyebrow: "Incoming queue",
      title: "Chat requests",
      description: "Review chatbot context, prioritize urgent needs and connect customers with the right agent.",
    },
    assigned: {
      eyebrow: "My workspace",
      title: "Assigned chats",
      description: "Conversations currently assigned to you across active and waiting states.",
    },
    unassigned: {
      eyebrow: "Team queue",
      title: "Unassigned chats",
      description: "Conversations that still need an owner.",
    },
  }[mode];

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
      <PageHeader
        {...copy}
        action={<Badge tone="blue">{base.length} conversations</Badge>}
      />
      <Card className="mt-7 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stus-border p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={17} />
            <Input
              className="pl-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, company or conversation ID"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="hidden items-center gap-2 text-xs font-bold text-stus-muted sm:flex">
              <Filter size={16} /> Filters
            </span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "All" | UserType)}
              className="h-11 rounded-xl border border-stus-border bg-white px-3 text-sm font-bold"
              aria-label="Filter by customer type"
            >
              <option>All</option>
              <option>Buyer</option>
              <option>Supplier</option>
            </select>
            <select
              value={priority}
              onChange={(event) =>
                setPriorityFilter(event.target.value as "All" | Priority)
              }
              className="h-11 rounded-xl border border-stus-border bg-white px-3 text-sm font-bold"
              aria-label="Filter by priority"
            >
              <option>All</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No conversations found"
            description="Try adjusting your search or filters. New requests will appear here automatically."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-stus-muted">
                    <th className="px-5 py-3 font-extrabold">Customer</th>
                    <th className="px-5 py-3 font-extrabold">Request</th>
                    <th className="px-5 py-3 font-extrabold">Waiting</th>
                    <th className="px-5 py-3 font-extrabold">Priority</th>
                    <th className="px-5 py-3 font-extrabold">Status</th>
                    <th className="px-5 py-3 text-right font-extrabold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stus-border">
                  {filtered.map((conversation) => (
                    <tr key={conversation.id} className="transition hover:bg-blue-50/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={conversation.customer.name} online={conversation.customer.online} />
                          <div>
                            <p className="text-sm font-extrabold">{conversation.customer.name}</p>
                            <p className="mt-1 text-xs text-stus-muted">{conversation.customer.company} · {conversation.customer.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[260px] px-5 py-4">
                        <p className="truncate text-sm font-bold">{conversation.reason}</p>
                        <p className="mt-1 text-xs text-stus-muted">{conversation.id}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-stus-muted">
                        <span className="flex items-center gap-2"><Clock3 size={15} /> {relativeTime(conversation.requestedAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={conversation.priority}
                          onChange={(event) =>
                            setPriority(conversation.id, event.target.value as Priority)
                          }
                          className="rounded-lg border border-stus-border bg-white px-2 py-1.5 text-xs font-bold"
                          aria-label={`Priority for ${conversation.id}`}
                        >
                          <option>Urgent</option><option>High</option><option>Medium</option><option>Low</option>
                        </select>
                      </td>
                      <td className="px-5 py-4"><Badge tone="blue">{conversation.status}</Badge></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => setPreview(conversation)}>
                            <Eye size={15} /> Preview
                          </Button>
                          {mode === "requests" ? (
                            <Button size="sm" onClick={() => accept(conversation.id)}>
                              <Check size={15} /> Accept
                            </Button>
                          ) : (
                            <Link href={`/chats/live/${conversation.id}`}><Button size="sm">Open <ArrowRight size={15} /></Button></Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-stus-border md:hidden">
              {filtered.map((conversation) => (
                <article key={conversation.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={conversation.customer.name} online={conversation.customer.online} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold">{conversation.customer.name}</h3>
                        <Badge tone={priorityTone(conversation.priority)}>{conversation.priority}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-stus-muted">{conversation.customer.company} · {conversation.customer.type}</p>
                      <p className="mt-3 text-sm font-bold">{conversation.reason}</p>
                      <p className="mt-1 text-xs text-stus-muted">{conversation.id} · {formatTime(conversation.requestedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setPreview(conversation)}>Preview</Button>
                    {mode === "requests" ? (
                      <Button size="sm" className="flex-1" onClick={() => accept(conversation.id)}>Accept</Button>
                    ) : (
                      <Link href={`/chats/live/${conversation.id}`} className="flex-1"><Button size="sm" className="w-full">Open chat</Button></Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} title="Conversation preview">
        {preview && (
          <div>
            <div className="flex items-center gap-3">
              <Avatar name={preview.customer.name} size="lg" online={preview.customer.online} />
              <div>
                <h3 className="font-black">{preview.customer.name}</h3>
                <p className="mt-1 text-sm text-stus-muted">{preview.customer.company} · {preview.customer.type}</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-blue-50/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Request reason</p>
              <p className="mt-2 text-sm font-bold">{preview.reason}</p>
              <p className="mt-1 text-xs text-stus-muted">{preview.product}</p>
            </div>
            <div className="mt-5">
              <h4 className="text-sm font-extrabold">Chatbot context</h4>
              <div className="mt-2 space-y-2">
                {preview.chatbotContext.map((item) => (
                  <div key={item.question} className="rounded-xl border border-stus-border p-3">
                    <p className="text-xs text-stus-muted">{item.question}</p>
                    <p className="mt-1 text-sm font-bold">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
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
              {!preview.assignedAgent && (
                <Button variant="secondary" onClick={() => assign(preview.id, "Ayesha Khan")}>
                  <UserPlus size={16} /> Assign to me
                </Button>
              )}
              <Link href={`/chats/live/${preview.id}`}><Button variant="secondary">Open conversation</Button></Link>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  Bot,
  Check,
  ChevronDown,
  FileText,
  Info,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
  WifiOff,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, Dialog, EmptyState, Input } from "@/components/ui";
import { agents } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";
import type { Conversation, ConversationStatus, Priority } from "@/types";

const activeStatuses: ConversationStatus[] = [
  "Pending",
  "Assigned",
  "Active",
  "Waiting for User",
  "Waiting for Agent",
];

function ConversationList({
  selectedId,
  onSelect,
}: {
  selectedId?: string;
  onSelect?: () => void;
}) {
  const conversations = usePortalStore((state) => state.conversations);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"All" | "Mine" | "Unread">("All");
  const items = useMemo(
    () =>
      conversations
        .filter((conversation) => activeStatuses.includes(conversation.status))
        .filter((conversation) => {
          if (tab === "Mine" && conversation.assignedAgent !== "Ayesha Khan")
            return false;
          if (tab === "Unread" && conversation.unread === 0) return false;
          return `${conversation.customer.name} ${conversation.id} ${conversation.reason}`
            .toLowerCase()
            .includes(query.toLowerCase());
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
    [conversations, query, tab],
  );

  return (
    <section className="flex h-full min-h-0 flex-col border-r border-stus-border bg-white">
      <div className="border-b border-stus-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-stus-dark">Conversations</h2>
            <p className="mt-1 text-xs text-stus-muted">{items.length} in your queue</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Conversation options">
            <MoreHorizontal size={20} />
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <Input
            className="h-10 pl-9"
            placeholder="Search conversations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 rounded-xl bg-slate-100 p-1">
          {(["All", "Mine", "Unread"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={cn(
                "h-8 cursor-pointer rounded-lg text-xs font-bold transition",
                tab === item ? "bg-white text-primary shadow-sm" : "text-stus-muted",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <EmptyState title="Queue is clear" description="No conversations match this view." />
        ) : (
          items.map((conversation) => {
            const last = conversation.messages.at(-1);
            return (
              <Link
                href={`/chats/live/${conversation.id}`}
                key={conversation.id}
                onClick={onSelect}
                className={cn(
                  "flex gap-3 border-b border-stus-border p-4 transition hover:bg-blue-50/60",
                  selectedId === conversation.id &&
                    "border-l-[3px] border-l-primary bg-blue-50",
                )}
              >
                <Avatar
                  name={conversation.customer.name}
                  online={conversation.customer.online}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-extrabold">
                      {conversation.customer.name}
                    </p>
                    <time className="shrink-0 text-[10px] text-stus-muted">
                      {formatTime(conversation.updatedAt)}
                    </time>
                  </div>
                  <p className="mt-1 truncate text-xs text-stus-muted">
                    {last?.kind === "agent" ? "You: " : ""}
                    {last?.body}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Badge tone={conversation.customer.type === "Buyer" ? "blue" : "purple"}>
                      {conversation.customer.type}
                    </Badge>
                    {conversation.priority === "Urgent" && <Badge tone="red">Urgent</Badge>}
                    {conversation.unread > 0 && (
                      <span className="ml-auto grid size-5 place-items-center rounded-full bg-primary text-[10px] font-black text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}

function CustomerDetails({ conversation }: { conversation: Conversation }) {
  return (
    <div className="h-full overflow-y-auto bg-white p-5">
      <div className="text-center">
        <Avatar name={conversation.customer.name} size="lg" online={conversation.customer.online} />
        <h2 className="mt-3 font-black text-stus-dark">{conversation.customer.name}</h2>
        <p className="mt-1 text-xs text-stus-muted">{conversation.customer.company}</p>
        <div className="mt-3 flex justify-center gap-2">
          <Badge tone={conversation.customer.type === "Buyer" ? "blue" : "purple"}>{conversation.customer.type}</Badge>
          <Badge tone="green">{conversation.customer.plan}</Badge>
        </div>
      </div>
      <section className="mt-6 border-t border-stus-border pt-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-stus-muted">Customer information</h3>
        <dl className="mt-3 space-y-3 text-sm">
          <div><dt className="text-xs text-stus-muted">Email</dt><dd className="mt-1 break-all font-bold">{conversation.customer.email}</dd></div>
          <div><dt className="text-xs text-stus-muted">Phone</dt><dd className="mt-1 font-bold">{conversation.customer.phone}</dd></div>
          <div><dt className="text-xs text-stus-muted">Current request</dt><dd className="mt-1 font-bold">{conversation.reason}</dd></div>
          <div><dt className="text-xs text-stus-muted">Product / service</dt><dd className="mt-1 font-bold">{conversation.product}</dd></div>
        </dl>
      </section>
      <section className="mt-6 border-t border-stus-border pt-5">
        <div className="flex items-center gap-2">
          <Bot size={17} className="text-primary" />
          <h3 className="text-xs font-black uppercase tracking-wider text-stus-muted">Chatbot context</h3>
        </div>
        <div className="mt-3 space-y-2">
          {conversation.chatbotContext.map((item) => (
            <div key={item.question} className="rounded-xl border border-stus-border bg-slate-50/60 p-3">
              <p className="text-[11px] text-stus-muted">{item.question}</p>
              <p className="mt-1 text-xs font-extrabold">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 border-t border-stus-border pt-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-stus-muted">Assignment</h3>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-blue-50 p-3">
          <Avatar name={conversation.assignedAgent || "Unassigned"} size="sm" />
          <div>
            <p className="text-xs font-extrabold">{conversation.assignedAgent || "Not assigned yet"}</p>
            <p className="mt-0.5 text-[11px] text-stus-muted">Support owner</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MessageTimeline({ conversation }: { conversation: Conversation }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const retry = usePortalStore((state) => state.retryMessage);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f9fb] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3 text-[11px] font-bold text-stus-muted">
          <span className="h-px flex-1 bg-stus-border" />
          Today
          <span className="h-px flex-1 bg-stus-border" />
        </div>
        {conversation.messages.map((message) => {
          if (message.kind === "system") {
            return (
              <div key={message.id} className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-stus-border" />
                <span className="flex items-center gap-2 rounded-full border border-stus-border bg-white px-3 py-1.5 text-[10px] font-bold text-stus-muted">
                  <Bot size={13} /> {message.body}
                </span>
                <span className="h-px flex-1 bg-stus-border" />
              </div>
            );
          }
          if (message.kind === "note") {
            return (
              <div key={message.id} className="my-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <div className="mb-1 flex items-center gap-2 text-xs font-black"><ShieldCheck size={15} /> Internal note · {message.sender}</div>
                {message.body}
              </div>
            );
          }
          const own = message.kind === "agent";
          const bot = message.kind === "bot";
          return (
            <div key={message.id} className={cn("mb-4 flex items-end gap-2", own && "justify-end")}>
              {!own && <Avatar name={message.sender} size="sm" />}
              <div className={cn("max-w-[82%] sm:max-w-[68%]", own && "text-right")}>
                <p className="mb-1 px-1 text-[10px] font-bold text-stus-muted">{message.sender} · {formatTime(message.createdAt)}</p>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-left text-sm leading-6 shadow-sm",
                    own
                      ? "rounded-br-md bg-primary text-white"
                      : bot
                        ? "rounded-bl-md border border-violet-100 bg-violet-50 text-stus-dark"
                        : "rounded-bl-md border border-stus-border bg-white text-stus-dark",
                  )}
                >
                  {message.body}
                  {message.attachment && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-black/5 p-2 text-xs font-bold">
                      <FileText size={16} /> {message.attachment.name} · {message.attachment.size}
                    </div>
                  )}
                </div>
                {own && (
                  <p className={cn("mt-1 px-1 text-[10px]", message.delivery === "failed" ? "text-red-600" : "text-stus-muted")}>
                    {message.delivery === "sending" ? "Sending…" : message.delivery === "failed" ? (
                      <button className="cursor-pointer font-bold underline" onClick={() => retry(conversation.id, message.id)}>Failed · retry</button>
                    ) : "Delivered"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export function LiveChatView({ selectedId }: { selectedId?: string }) {
  const router = useRouter();
  const conversations = usePortalStore((state) => state.conversations);
  const accept = usePortalStore((state) => state.acceptConversation);
  const assign = usePortalStore((state) => state.assignConversation);
  const setPriority = usePortalStore((state) => state.setPriority);
  const setStatus = usePortalStore((state) => state.setStatus);
  const sendMessage = usePortalStore((state) => state.sendMessage);
  const addNote = usePortalStore((state) => state.addNote);
  const closeConversation = usePortalStore((state) => state.closeConversation);
  const markRead = usePortalStore((state) => state.markConversationRead);
  const active = conversations.filter((item) => activeStatuses.includes(item.status));
  const conversation =
    conversations.find((item) => item.id === selectedId) || active[0];
  const conversationId = conversation?.id;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeNote, setCloseNote] = useState("");
  const [body, setBody] = useState("");
  const [noteMode, setNoteMode] = useState(false);
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, markRead]);

  if (!conversation) {
    return <EmptyState title="No active conversations" description="Accept a chat request to start a conversation." />;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = body.trim();
    if (!value) return;
    if (noteMode) addNote(conversation.id, value);
    else sendMessage(conversation.id, value);
    setBody("");
    setNoteMode(false);
  };

  return (
    <div className="relative h-full min-h-[calc(100dvh-5rem)] overflow-hidden">
      {disconnected && (
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-xs font-bold text-amber-900">
          <WifiOff size={15} /> Connection interrupted. Reconnecting…
          <button className="ml-2 cursor-pointer underline" onClick={() => setDisconnected(false)}>Restore demo</button>
        </div>
      )}
      <div className="grid h-full min-h-[calc(100dvh-5rem)] grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_340px]">
        <div className="hidden min-h-0 md:block">
          <ConversationList selectedId={conversation.id} />
        </div>
        <section className="flex min-h-0 min-w-0 flex-col bg-white">
          <header className="flex min-h-[76px] items-center gap-3 border-b border-stus-border px-4 sm:px-5">
            <Link href="/chats/live" className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Back to conversations">
                <MessageSquareText size={20} />
              </Button>
            </Link>
            <Avatar name={conversation.customer.name} online={conversation.customer.online} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-black sm:text-base">{conversation.customer.name}</h1>
                <Badge tone={conversation.customer.type === "Buyer" ? "blue" : "purple"}>{conversation.customer.type}</Badge>
              </div>
              <p className="mt-1 truncate text-xs text-stus-muted">
                {conversation.customer.online ? "Online" : "Last seen recently"} · {conversation.id}
              </p>
            </div>
            <div className="hidden items-center gap-2 xl:flex">
              {conversation.status === "Pending" && (
                <Button size="sm" onClick={() => accept(conversation.id)}><Check size={15} /> Accept</Button>
              )}
              <label className="relative">
                <span className="sr-only">Assign agent</span>
                <select
                  value={conversation.assignedAgent || ""}
                  onChange={(event) => assign(conversation.id, event.target.value)}
                  className="h-9 appearance-none rounded-xl border border-stus-border bg-white pl-3 pr-8 text-xs font-bold"
                >
                  <option value="">Assign agent</option>
                  {agents.map((agent) => <option key={agent.id}>{agent.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 text-stus-muted" size={15} />
              </label>
              <select
                value={conversation.status}
                onChange={(event) => setStatus(conversation.id, event.target.value as ConversationStatus)}
                className="h-9 rounded-xl border border-stus-border bg-white px-3 text-xs font-bold"
                aria-label="Conversation status"
              >
                {activeStatuses.map((status) => <option key={status}>{status}</option>)}
                <option>Resolved</option>
              </select>
              <select
                value={conversation.priority}
                onChange={(event) =>
                  setPriority(conversation.id, event.target.value as Priority)
                }
                className="h-9 rounded-xl border border-stus-border bg-white px-3 text-xs font-bold"
                aria-label="Conversation priority"
              >
                <option>Urgent</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <Button variant="secondary" size="icon" aria-label="View customer details" onClick={() => setDetailsOpen(true)}>
              <Info size={18} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Close conversation" onClick={() => setCloseOpen(true)}>
              <Archive size={18} />
            </Button>
          </header>
          <MessageTimeline conversation={conversation} />
          <form onSubmit={submit} className={cn("border-t p-3 sm:p-4", noteMode ? "border-amber-200 bg-amber-50" : "border-stus-border bg-white")}>
            {noteMode && (
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-amber-800">
                <span className="flex items-center gap-2"><ShieldCheck size={15} /> Internal note — customers cannot see this</span>
                <button type="button" className="cursor-pointer" onClick={() => setNoteMode(false)}><X size={16} /></button>
              </div>
            )}
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-stus-border bg-white p-2 shadow-sm focus-within:border-primary">
              <Button variant="ghost" size="icon" aria-label="Attach a file" onClick={() => setBody((value) => `${value}${value ? " " : ""}[Attached: order-details.pdf]`)}>
                <Paperclip size={19} />
              </Button>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder={noteMode ? "Write an internal note…" : "Type your message…"}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-sm outline-none placeholder:text-slate-400"
              />
              <Button variant="ghost" size="icon" aria-label="Add emoji" className="hidden sm:inline-flex" onClick={() => setBody((value) => `${value} 🙂`)}>
                <Smile size={19} />
              </Button>
              <Button type="submit" size="icon" aria-label={noteMode ? "Add note" : "Send message"} disabled={!body.trim()}>
                <Send size={18} />
              </Button>
            </div>
            <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setNoteMode((value) => !value)}
                className="cursor-pointer text-[11px] font-bold text-stus-muted hover:text-primary"
              >
                {noteMode ? "Switch to reply" : "Add internal note"}
              </button>
              <button type="button" onClick={() => setDisconnected(true)} className="text-[10px] text-slate-400 hover:text-stus-muted">Simulate disconnect</button>
            </div>
          </form>
        </section>
        <aside className="hidden min-h-0 border-l border-stus-border 2xl:block">
          <CustomerDetails conversation={conversation} />
        </aside>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35" onMouseDown={(event) => event.target === event.currentTarget && setDetailsOpen(false)}>
          <div className="relative h-full w-full max-w-sm shadow-2xl">
            <button
              className="absolute right-4 top-4 z-10 grid size-9 cursor-pointer place-items-center rounded-xl border border-stus-border bg-white"
              onClick={() => setDetailsOpen(false)}
              aria-label="Close customer details"
            >
              <X size={18} />
            </button>
            <CustomerDetails conversation={conversation} />
          </div>
        </div>
      )}

      <Dialog open={closeOpen} onClose={() => setCloseOpen(false)} title="Close conversation">
        <p className="text-sm leading-6 text-stus-muted">This removes the chat from the active queue. The transcript will remain available in history.</p>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold">Closing reason</span>
          <select className="h-11 w-full rounded-xl border border-stus-border bg-white px-3 text-sm">
            <option>Request resolved</option><option>No response from customer</option><option>Duplicate request</option><option>Other</option>
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold">Closing note (optional)</span>
          <textarea value={closeNote} onChange={(event) => setCloseNote(event.target.value)} className="min-h-24 w-full rounded-xl border border-stus-border p-3 text-sm outline-none focus:border-primary" />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm text-stus-muted">
          <input type="checkbox" defaultChecked className="size-4 accent-[#013f92]" /> Notify customer
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCloseOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            closeConversation(conversation.id, closeNote);
            setCloseOpen(false);
            router.push("/chats/live");
          }}>Confirm close</Button>
        </div>
      </Dialog>
    </div>
  );
}

export function MobileConversationIndex() {
  return (
    <div className="h-[calc(100dvh-5rem)] md:hidden">
      <ConversationList />
    </div>
  );
}

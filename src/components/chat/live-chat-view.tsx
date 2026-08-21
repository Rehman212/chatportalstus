"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  Building2,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  FileText,
  ImageIcon,
  Info,
  Mail,
  MessageSquareText,
  Mic,
  Package,
  Paperclip,
  Pause,
  Phone,
  Play,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Square,
  UserRound,
  WifiOff,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, Dialog, EmptyState } from "@/components/ui";
import { agents } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";
import type {
  Conversation,
  ConversationStatus,
  MessageAttachment,
  Priority,
} from "@/types";

const EMOJIS = [
  "😀", "😁", "😂", "😊", "😍", "🤗", "👍", "🙏",
  "✅", "🔥", "💯", "🎉", "👋", "🤝", "😅", "😎",
  "😢", "😮", "🤔", "👏", "💪", "❤️", "⭐", "📌",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

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
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 border-b border-[#e8eef5] px-4 pb-3 pt-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#0a275f]">
            Inbox
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            {items.length} open
          </span>
        </div>

        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or ID"
            aria-label="Search conversations"
            className="h-9 w-full rounded-md border border-[#e2eaf3] bg-[#f7f9fc] pl-9 pr-3 text-[12.5px] text-[#0a275f] outline-none transition placeholder:text-slate-400 focus:border-[#013f92]/35 focus:bg-white focus:ring-2 focus:ring-[#013f92]/08"
          />
        </div>

        <div className="mt-3 flex gap-0.5">
          {(["All", "Mine", "Unread"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                "h-7 cursor-pointer rounded-md px-2.5 text-[11px] font-semibold transition",
                tab === item
                  ? "bg-[#0a275f] text-white"
                  : "text-slate-500 hover:bg-[#f1f5f9] hover:text-[#0a275f]",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <EmptyState
            title="Queue is clear"
            description="No conversations match this view."
          />
        ) : (
          items.map((conversation) => {
            const last = conversation.messages.at(-1);
            const selected = selectedId === conversation.id;
            const unread = conversation.unread > 0;
            return (
              <Link
                href={`/chats/live/${conversation.id}`}
                key={conversation.id}
                onClick={onSelect}
                className={cn(
                  "flex gap-3 border-b border-[#f0f4f8] px-4 py-3.5 transition",
                  selected
                    ? "bg-[#eef4ff]"
                    : "hover:bg-[#f7f9fc]",
                )}
              >
                <Avatar
                  name={conversation.customer.name}
                  online={conversation.customer.online}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "truncate text-[13px] tracking-tight text-[#0a275f]",
                        unread ? "font-bold" : "font-semibold",
                      )}
                    >
                      {conversation.customer.name}
                    </p>
                    <time className="shrink-0 text-[10px] font-medium text-slate-400">
                      {formatTime(conversation.updatedAt)}
                    </time>
                  </div>
                  <p className="mt-0.5 truncate text-[11.5px] font-medium text-slate-500">
                    {conversation.reason}
                  </p>
                  <p
                    className={cn(
                      "mt-1 truncate text-[12px]",
                      unread ? "font-medium text-slate-700" : "text-slate-400",
                    )}
                  >
                    {last?.kind === "agent" ? "You: " : ""}
                    {last?.body}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                        conversation.customer.type === "Buyer"
                          ? "bg-blue-50 text-[#013f92]"
                          : "bg-violet-50 text-violet-700",
                      )}
                    >
                      {conversation.customer.type}
                    </span>
                    {conversation.priority === "Urgent" && (
                      <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                        Urgent
                      </span>
                    )}
                    {unread && (
                      <span className="ml-auto grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#013f92] px-1 text-[9px] font-bold text-white">
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

function DetailField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[20px_1fr] gap-x-2.5 gap-y-0.5">
      <Icon size={14} className="mt-0.5 text-[#013f92]" />
      <dt className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </dt>
      <dd className="col-start-2 break-words text-[12.5px] font-semibold leading-5 text-[#0a275f]">
        {value}
      </dd>
    </div>
  );
}

function CustomerDetails({ conversation }: { conversation: Conversation }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-[#fafbfd]">
      <div className="border-b border-[#e8eef5] bg-white px-5 py-5">
        <div className="flex items-start gap-3">
          <Avatar
            name={conversation.customer.name}
            size="lg"
            online={conversation.customer.online}
          />
          <div className="min-w-0 pt-0.5">
            <h2 className="truncate text-[15px] font-bold tracking-tight text-[#0a275f]">
              {conversation.customer.name}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-slate-500">
              <Building2 size={12} className="shrink-0" />
              <span className="truncate">{conversation.customer.company}</span>
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge
                tone={conversation.customer.type === "Buyer" ? "blue" : "purple"}
              >
                {conversation.customer.type}
              </Badge>
              <Badge tone="green">{conversation.customer.plan}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 py-5">
        <section>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Details
          </h3>
          <dl className="space-y-4">
            <DetailField icon={Mail} label="Email" value={conversation.customer.email} />
            <DetailField icon={Phone} label="Phone" value={conversation.customer.phone} />
            <DetailField
              icon={MessageSquareText}
              label="Request"
              value={conversation.reason}
            />
            <DetailField
              icon={Package}
              label="Product"
              value={conversation.product}
            />
          </dl>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Bot size={14} className="text-[#013f92]" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Bot context
            </h3>
          </div>
          <div className="space-y-2">
            {conversation.chatbotContext.map((item) => (
              <div
                key={item.question}
                className="rounded-lg border border-[#e8eef5] bg-white px-3 py-2.5"
              >
                <p className="text-[11px] text-slate-400">{item.question}</p>
                <p className="mt-1 text-[12.5px] font-semibold leading-5 text-[#0a275f]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Assignment
          </h3>
          <div className="flex items-center gap-3 rounded-lg border border-[#dce8f6] bg-white px-3 py-3">
            <Avatar name={conversation.assignedAgent || "Unassigned"} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-[#0a275f]">
                {conversation.assignedAgent || "Unassigned"}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                <UserRound size={11} /> Owner
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MessageMedia({
  attachment,
  own,
}: {
  attachment: MessageAttachment;
  own: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (attachment.type === "image" && attachment.url) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noreferrer"
        className="mt-1 block overflow-hidden rounded-xl"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-56 w-full max-w-sm object-cover"
        />
      </a>
    );
  }

  if (attachment.type === "voice") {
    return (
      <div
        className={cn(
          "mt-1 flex min-w-[200px] items-center gap-3 rounded-xl px-3 py-2.5",
          own ? "bg-white/15" : "bg-[#f1f5f9]",
        )}
      >
        <button
          type="button"
          aria-label={playing ? "Pause voice message" : "Play voice message"}
          onClick={() => setPlaying((value) => !value)}
          className={cn(
            "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full",
            own ? "bg-white text-[#013f92]" : "bg-[#013f92] text-white",
          )}
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <div className="flex flex-1 items-end gap-[3px]">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "w-[3px] rounded-full",
                own ? "bg-white/80" : "bg-[#013f92]/70",
                playing && "animate-pulse",
              )}
              style={{ height: `${8 + ((index * 7) % 16)}px` }}
            />
          ))}
        </div>
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            own ? "text-white/80" : "text-slate-500",
          )}
        >
          {formatDuration(attachment.durationSec || 0)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-semibold",
        own ? "bg-white/15" : "bg-[#f4f7fb]",
      )}
    >
      {attachment.type === "image" ? <ImageIcon size={14} /> : <FileText size={14} />}
      <span className="truncate">{attachment.name}</span>
      <span className="opacity-60">{attachment.size}</span>
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
    <div className="relative min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#eef3f9_0%,#f7f9fc_40%,#f7f9fc_100%)]">
      <div className="flex w-full flex-col gap-1 px-5 py-6 lg:px-8">
        <div className="mb-5 flex justify-center">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 shadow-[0_1px_2px_rgba(15,35,70,.06)] ring-1 ring-[#e2eaf3]">
            Today
          </span>
        </div>

        {conversation.messages.map((message, index) => {
          const prev = conversation.messages[index - 1];
          const sameSender =
            prev &&
            prev.kind === message.kind &&
            "sender" in prev &&
            "sender" in message &&
            prev.sender === message.sender;

          if (message.kind === "system") {
            return (
              <div key={message.id} className="my-4 flex justify-center">
                <div className="flex max-w-[90%] items-start gap-2 rounded-xl bg-white/90 px-3.5 py-2.5 text-[12px] leading-5 text-slate-500 shadow-[0_1px_3px_rgba(15,35,70,.06)] ring-1 ring-[#e4ebf3]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#eef3ff] text-[#013f92]">
                    <Bot size={11} />
                  </span>
                  <span>{message.body}</span>
                </div>
              </div>
            );
          }

          if (message.kind === "note") {
            return (
              <div
                key={message.id}
                className="my-3 rounded-xl border border-dashed border-amber-300/80 bg-[linear-gradient(135deg,#fffbeb,#fef3c7)] px-4 py-3 text-[13px] leading-5 text-amber-950"
              >
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                  <ShieldCheck size={13} />
                  Internal note · {message.sender}
                  <span className="ml-auto font-medium text-amber-700/70">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                {message.body}
              </div>
            );
          }

          const own = message.kind === "agent";
          const bot = message.kind === "bot";

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-2.5",
                own ? "justify-end" : "justify-start",
                sameSender ? "mt-1" : "mt-4",
              )}
            >
              {!own && (
                <div className={cn("shrink-0", sameSender && "invisible")}>
                  <Avatar name={message.sender} size="sm" />
                </div>
              )}

              <div
                className={cn(
                  "flex w-full max-w-[72%] flex-col sm:max-w-[65%] xl:max-w-[58%]",
                  own ? "items-end" : "items-start",
                )}
              >
                {!sameSender && (
                  <div
                    className={cn(
                      "mb-1.5 flex items-center gap-2 px-0.5",
                      own && "flex-row-reverse",
                    )}
                  >
                    <span className="text-[12px] font-semibold text-[#0a275f]">
                      {own ? "You" : message.sender}
                    </span>
                    {bot && (
                      <span className="rounded bg-[#e8effc] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#013f92]">
                        Bot
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-slate-400">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "relative px-3.5 py-2.5 text-[13.5px] leading-[1.55]",
                    own
                      ? "rounded-[18px] rounded-br-md bg-[linear-gradient(160deg,#0254b3_0%,#013f92_100%)] text-white shadow-[0_6px_16px_rgba(1,63,146,.22)]"
                      : bot
                        ? "rounded-[18px] rounded-bl-md bg-[#edf2fb] text-[#0a275f] ring-1 ring-[#d5e0f2]"
                        : "rounded-[18px] rounded-bl-md bg-white text-[#1a2f4a] shadow-[0_2px_10px_rgba(15,35,70,.07)] ring-1 ring-[#e6edf5]",
                  )}
                >
                  {message.attachment && (
                    <MessageMedia attachment={message.attachment} own={own} />
                  )}
                  {message.body &&
                    message.body !== "Voice message" &&
                    message.body !== message.attachment?.name && (
                      <p className={cn(message.attachment && "mt-2")}>{message.body}</p>
                    )}
                </div>

                {own && (
                  <div
                    className={cn(
                      "mt-1 flex items-center gap-1 px-0.5 text-[10px] font-medium",
                      message.delivery === "failed"
                        ? "text-red-600"
                        : "text-slate-400",
                    )}
                  >
                    {message.delivery === "sending" ? (
                      "Sending…"
                    ) : message.delivery === "failed" ? (
                      <button
                        type="button"
                        className="cursor-pointer font-bold underline"
                        onClick={() => retry(conversation.id, message.id)}
                      >
                        Failed · retry
                      </button>
                    ) : (
                      <>
                        Delivered
                        <CheckCheck size={12} className="text-[#0254b3]" />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}

function FieldControl({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="inline-flex items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>
      <span className="relative inline-flex">
        <select
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 cursor-pointer appearance-none rounded-md border border-[#e2eaf3] bg-white py-0 pl-2.5 pr-7 text-[11px] font-semibold text-[#0a275f] outline-none hover:border-[#b8c9dc] focus:border-[#013f92]/40 focus:ring-2 focus:ring-[#013f92]/10"
        >
          {children}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </span>
    </label>
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
  const closeConversation = usePortalStore((state) => state.closeConversation);
  const markRead = usePortalStore((state) => state.markConversationRead);
  const active = conversations.filter((item) =>
    activeStatuses.includes(item.status),
  );
  const conversation =
    conversations.find((item) => item.id === selectedId) || active[0];
  const conversationId = conversation?.id;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeNote, setCloseNote] = useState("");
  const [body, setBody] = useState("");
  const [pendingFile, setPendingFile] = useState<MessageAttachment | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const [disconnected, setDisconnected] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recordTimer = useRef<number | null>(null);

  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, markRead]);

  useEffect(() => {
    return () => {
      if (recordTimer.current) window.clearInterval(recordTimer.current);
    };
  }, []);

  if (!conversation) {
    return (
      <div className="grid h-full place-items-center bg-white">
        <EmptyState
          title="No active conversations"
          description="Accept a chat request to start a conversation."
        />
      </div>
    );
  }

  const clearPending = () => {
    if (pendingFile?.url) URL.revokeObjectURL(pendingFile.url);
    setPendingFile(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = body.trim();
    if (!value && !pendingFile) return;
    sendMessage(conversation.id, value, pendingFile || undefined);
    setBody("");
    setPendingFile(null);
    setEmojiOpen(false);
  };

  const onPickFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const url = URL.createObjectURL(file);
    setPendingFile({
      name: file.name,
      size: formatBytes(file.size),
      type: isImage ? "image" : "file",
      url: isImage ? url : url,
    });
  };

  const startRecording = () => {
    setRecording(true);
    setRecordSec(0);
    setEmojiOpen(false);
    recordTimer.current = window.setInterval(() => {
      setRecordSec((value) => value + 1);
    }, 1000);
  };

  const cancelRecording = () => {
    if (recordTimer.current) window.clearInterval(recordTimer.current);
    setRecording(false);
    setRecordSec(0);
  };

  const sendVoice = () => {
    if (recordTimer.current) window.clearInterval(recordTimer.current);
    const duration = Math.max(recordSec, 1);
    setRecording(false);
    setRecordSec(0);
    sendMessage(conversation.id, "", {
      name: "Voice message",
      size: `${duration}s`,
      type: "voice",
      durationSec: duration,
    });
  };

  return (
    <div className="absolute inset-0 bottom-20 overflow-hidden bg-white lg:bottom-0">
      {disconnected && (
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-xs font-bold text-amber-900">
          <WifiOff size={14} />
          Connection interrupted. Reconnecting…
          <button
            type="button"
            className="ml-2 cursor-pointer underline"
            onClick={() => setDisconnected(false)}
          >
            Restore
          </button>
        </div>
      )}

      <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px] 2xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <div className="hidden min-h-0 border-r border-[#e8eef5] md:block">
          <ConversationList selectedId={conversation.id} />
        </div>

        <section className="flex min-h-0 min-w-0 flex-col border-r border-[#e8eef5]">
          {/* Workspace header */}
          <header className="shrink-0 border-b border-[#e8eef5] bg-white">
            <div className="flex items-center gap-3 px-4 py-3">
              <Link href="/chats/live" className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Back to conversations"
                >
                  <MessageSquareText size={18} />
                </Button>
              </Link>

              <Avatar
                name={conversation.customer.name}
                online={conversation.customer.online}
                size="sm"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-[14px] font-bold text-[#0a275f]">
                    {conversation.customer.name}
                  </h1>
                  <span className="hidden rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline">
                    {conversation.customer.type}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  <span
                    className={
                      conversation.customer.online
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-slate-400"
                    }
                  >
                    {conversation.customer.online ? "Online" : "Away"}
                  </span>
                  <span className="mx-1.5">·</span>
                  {conversation.id}
                  <span className="mx-1.5">·</span>
                  {conversation.reason}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Customer details"
                  onClick={() => setDetailsOpen(true)}
                  className="grid size-8 cursor-pointer place-items-center rounded-md text-slate-500 transition hover:bg-[#f1f5f9] hover:text-[#0a275f] xl:hidden"
                >
                  <Info size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Close conversation"
                  onClick={() => setCloseOpen(true)}
                  className="grid size-8 cursor-pointer place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Archive size={16} />
                </button>
              </div>
            </div>

            {/* Clear action sequence: Owner → Assign/Transfer → Status → Priority */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0f4f8] bg-[#fafbfd] px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  Owner
                </span>
                {conversation.assignedAgent ? (
                  <div className="flex items-center gap-2 rounded-full border border-[#dce8f6] bg-white py-1 pl-1 pr-3">
                    <Avatar name={conversation.assignedAgent} size="sm" />
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-[12px] font-bold text-[#0a275f]">
                        {conversation.assignedAgent}
                      </p>
                      <p className="text-[10px] font-medium text-emerald-600">
                        Assigned
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="rounded-full border border-dashed border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                    Unassigned
                  </span>
                )}
              </div>

              <span className="hidden h-6 w-px bg-[#e2eaf3] sm:block" />

              <div className="flex flex-wrap items-center gap-2">
                {!conversation.assignedAgent ||
                conversation.status === "Pending" ? (
                  <Button
                    size="sm"
                    className="h-8 rounded-md px-3 text-[11px]"
                    onClick={() => accept(conversation.id)}
                  >
                    <Check size={13} /> Assign to me
                  </Button>
                ) : conversation.assignedAgent !== "Ayesha Khan" ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 rounded-md px-3 text-[11px]"
                    onClick={() => accept(conversation.id)}
                  >
                    <UserRound size={13} /> Take over
                  </Button>
                ) : null}

                <FieldControl
                  label="Transfer"
                  value={conversation.assignedAgent || ""}
                  onChange={(value) => {
                    if (value) assign(conversation.id, value);
                  }}
                >
                  <option value="" disabled>
                    Choose agent
                  </option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                </FieldControl>
              </div>

              <span className="hidden h-6 w-px bg-[#e2eaf3] md:block" />

              <FieldControl
                label="Status"
                value={conversation.status}
                onChange={(value) =>
                  setStatus(conversation.id, value as ConversationStatus)
                }
              >
                {activeStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
                <option>Resolved</option>
              </FieldControl>

              <FieldControl
                label="Priority"
                value={conversation.priority}
                onChange={(value) =>
                  setPriority(conversation.id, value as Priority)
                }
              >
                <option>Urgent</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </FieldControl>
            </div>
          </header>

          <MessageTimeline conversation={conversation} />

          <form
            onSubmit={submit}
            className="shrink-0 border-t border-[#e5ecf4] bg-[#f7f9fc] px-5 py-3 lg:px-8"
          >
            <div className="w-full">
              {recording ? (
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,35,70,.08)] ring-1 ring-red-200">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full bg-red-500" />
                  </span>
                  <div className="flex flex-1 items-end gap-1">
                    {Array.from({ length: 24 }).map((_, index) => (
                      <span
                        key={index}
                        className="w-1 animate-pulse rounded-full bg-red-400"
                        style={{
                          height: `${10 + ((index * 5 + recordSec) % 18)}px`,
                          animationDelay: `${index * 40}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] font-bold tabular-nums text-red-600">
                    {formatDuration(recordSec)}
                  </span>
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="grid size-9 cursor-pointer place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Cancel recording"
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={sendVoice}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#013f92] px-3.5 text-[12px] font-semibold text-white hover:bg-[#0254b3]"
                  >
                    <Square size={12} fill="currentColor" />
                    Send voice
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,35,70,.08)] ring-1 ring-[#dce6f2] transition focus-within:ring-[#013f92]/40">
                  {pendingFile && (
                    <div className="flex items-center gap-3 border-b border-[#eef2f7] px-3.5 py-2.5">
                      {pendingFile.type === "image" && pendingFile.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pendingFile.url}
                          alt={pendingFile.name}
                          className="size-12 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="grid size-12 place-items-center rounded-lg bg-[#eef3ff] text-[#013f92]">
                          <FileText size={18} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-[#0a275f]">
                          {pendingFile.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{pendingFile.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={clearPending}
                        className="grid size-8 cursor-pointer place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Remove attachment"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}

                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    rows={2}
                    placeholder={
                      pendingFile
                        ? "Add a caption (optional)…"
                        : "Write a reply to the customer…"
                    }
                    className="max-h-36 min-h-[52px] w-full resize-none bg-transparent px-3.5 py-3 text-[13.5px] leading-5 text-[#0a275f] outline-none placeholder:text-slate-400"
                  />

                  <div className="relative flex items-center gap-1 border-t border-[#eef2f7] bg-[#fbfcfe] px-2 py-1.5">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.txt"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) onPickFile(file);
                        event.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Upload media"
                      onClick={() => fileRef.current?.click()}
                      className="grid size-8 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-[#0a275f]"
                    >
                      <Paperclip size={16} />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Open emoji picker"
                        aria-expanded={emojiOpen}
                        onClick={() => setEmojiOpen((value) => !value)}
                        className={cn(
                          "grid size-8 cursor-pointer place-items-center rounded-lg transition",
                          emojiOpen
                            ? "bg-white text-[#013f92]"
                            : "text-slate-400 hover:bg-white hover:text-[#0a275f]",
                        )}
                      >
                        <Smile size={16} />
                      </button>
                      {emojiOpen && (
                        <div className="absolute bottom-[calc(100%+8px)] left-0 z-20 w-[260px] rounded-xl border border-[#e2eaf3] bg-white p-2 shadow-xl">
                          <div className="grid grid-cols-8 gap-0.5">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                className="grid size-8 cursor-pointer place-items-center rounded-md text-base hover:bg-[#f1f5f9]"
                                onClick={() => {
                                  setBody((value) => `${value}${emoji}`);
                                  setEmojiOpen(false);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label="Record voice message"
                      onClick={startRecording}
                      className="grid size-8 cursor-pointer place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-[#0a275f]"
                    >
                      <Mic size={16} />
                    </button>

                    <span className="ml-1 hidden text-[10px] text-slate-300 sm:inline">
                      Enter to send · Shift+Enter for new line
                    </span>

                    <button
                      type="button"
                      onClick={() => setDisconnected(true)}
                      className="ml-auto mr-1 hidden size-7 cursor-pointer place-items-center rounded-full text-slate-300 transition hover:bg-white hover:text-slate-500 sm:grid"
                      aria-label="Simulate disconnect"
                      title="Simulate disconnect"
                    >
                      <WifiOff size={13} />
                    </button>

                    <button
                      type="submit"
                      aria-label="Send message"
                      disabled={!body.trim() && !pendingFile}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#013f92] px-3 text-[12px] font-semibold text-white transition enabled:cursor-pointer enabled:hover:bg-[#0254b3] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Send size={13} />
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </section>

        <aside className="hidden min-h-0 xl:block">
          <CustomerDetails conversation={conversation} />
        </aside>
      </div>

      {detailsOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setDetailsOpen(false)
          }
        >
          <div className="relative h-full w-full max-w-sm bg-white shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid size-8 cursor-pointer place-items-center rounded-md border border-[#e8eef5] bg-white"
              onClick={() => setDetailsOpen(false)}
              aria-label="Close customer details"
            >
              <X size={16} />
            </button>
            <CustomerDetails conversation={conversation} />
          </div>
        </div>
      )}

      <Dialog
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        title="Close conversation"
      >
        <p className="text-sm leading-6 text-stus-muted">
          This removes the chat from the active queue. The transcript stays in
          history.
        </p>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold">Closing reason</span>
          <select className="h-11 w-full rounded-xl border border-stus-border bg-white px-3 text-sm">
            <option>Request resolved</option>
            <option>No response from customer</option>
            <option>Duplicate request</option>
            <option>Other</option>
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold">
            Closing note (optional)
          </span>
          <textarea
            value={closeNote}
            onChange={(event) => setCloseNote(event.target.value)}
            className="min-h-24 w-full rounded-xl border border-stus-border p-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm text-stus-muted">
          <input type="checkbox" defaultChecked className="size-4 accent-[#013f92]" />
          Notify customer
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setCloseOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              closeConversation(conversation.id, closeNote);
              setCloseOpen(false);
              router.push("/chats/live");
            }}
          >
            Confirm close
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export function MobileConversationIndex() {
  return (
    <div className="absolute inset-0 bottom-20 overflow-hidden bg-white md:hidden">
      <ConversationList />
    </div>
  );
}

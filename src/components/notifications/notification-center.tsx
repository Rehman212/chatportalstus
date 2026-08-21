"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  BellRing,
  CheckCheck,
  Info,
  MessageCircle,
  ShieldAlert,
  Trash2,
  UserCheck,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/portal-shell";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import { usePortalStore } from "@/stores/portal-store";
import type { PortalNotification } from "@/types";

const notificationIcon = (type: PortalNotification["type"]) => {
  if (type === "request") return ShieldAlert;
  if (type === "message") return MessageCircle;
  if (type === "assignment") return UserCheck;
  if (type === "closed") return CheckCheck;
  return Info;
};

export function NotificationCenter() {
  const notifications = usePortalStore((state) => state.notifications);
  const markRead = usePortalStore((state) => state.markNotificationRead);
  const markAll = usePortalStore((state) => state.markAllNotificationsRead);
  const remove = usePortalStore((state) => state.removeNotification);
  const [tab, setTab] = useState<"All" | "Unread">("All");
  const [sound, setSound] = useState(true);
  const [banner, setBanner] = useState(true);
  const [permission, setPermission] = useState<string>("default");
  const items = notifications.filter((item) => tab === "All" || !item.read);
  const unread = notifications.filter((item) => !item.read).length;

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    const result = await window.Notification.requestPermission();
    setPermission(result);
    if (result === "granted") setBanner(false);
  };

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow="Stay up to date"
        title="Notifications"
        description="Assignments, messages and system updates from across your support workspace."
        action={
          <Button variant="secondary" onClick={() => setSound((value) => !value)}>
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            Sound {sound ? "on" : "off"}
          </Button>
        }
      />
      {banner && (
        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 p-5 sm:flex-row sm:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm"><BellRing size={21} /></span>
          <div className="flex-1">
            <p className="font-extrabold text-stus-dark">Never miss a customer waiting</p>
            <p className="mt-1 text-sm leading-6 text-stus-muted">
              Allow browser notifications for new requests and messages while this tab is in the background.
              {permission === "denied" && " Notifications are blocked in your browser settings."}
              {permission === "unsupported" && " This browser does not support desktop notifications."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={requestPermission}>Allow notifications</Button>
            <Button variant="ghost" size="icon" aria-label="Dismiss banner" onClick={() => setBanner(false)}><X size={18} /></Button>
          </div>
        </div>
      )}
      <Card className="mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stus-border p-4">
          <div className="flex rounded-xl bg-slate-100 p-1">
            {(["All", "Unread"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`h-9 cursor-pointer rounded-lg px-4 text-xs font-bold ${tab === item ? "bg-white text-primary shadow-sm" : "text-stus-muted"}`}
              >
                {item} {item === "Unread" && unread > 0 ? `(${unread})` : ""}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" disabled={unread === 0} onClick={markAll}>
            <CheckCheck size={16} /> Mark all as read
          </Button>
        </div>
        {items.length === 0 ? (
          <EmptyState title="You’re all caught up" description="There are no unread notifications right now." />
        ) : (
          <div className="divide-y divide-stus-border">
            {items.map((item) => {
              const Icon = notificationIcon(item.type);
              return (
                <article key={item.id} className={`flex gap-4 p-4 sm:p-5 ${item.read ? "bg-white" : "bg-blue-50/45"}`}>
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${item.read ? "bg-slate-100 text-stus-muted" : "bg-primary text-white"}`}>
                    <Icon size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-extrabold">{item.title}</h2>
                      {!item.read && <Badge tone="blue">New</Badge>}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-stus-muted">{item.detail}</p>
                    <p className="mt-2 text-[11px] font-bold text-slate-400">{relativeTime(item.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {item.conversationId && (
                      <Link href={`/chats/live/${item.conversationId}`} onClick={() => markRead(item.id)}>
                        <Button variant="secondary" size="sm" className="hidden sm:inline-flex">Open chat</Button>
                      </Link>
                    )}
                    {!item.read && <Button variant="ghost" size="icon" aria-label="Mark as read" onClick={() => markRead(item.id)}><CheckCheck size={17} /></Button>}
                    <Button variant="ghost" size="icon" aria-label="Delete notification" onClick={() => remove(item.id)}><Trash2 size={16} /></Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-stus-muted">
        <Bell size={14} /> Browser permission is controlled by your device and browser settings.
      </div>
    </div>
  );
}

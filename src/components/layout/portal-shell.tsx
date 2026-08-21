"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
  Clock3,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeft,
  RotateCcw,
  Search,
  Settings,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { StusBrand } from "@/components/brand";
import { Avatar, Badge, Button, Card, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { usePortalStore, useStoreHydrated } from "@/stores/portal-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chats/live", label: "Live chats", icon: MessageCircle },
  { href: "/chats/requests", label: "Chat requests", icon: Inbox, count: true },
  { href: "/chats/assigned", label: "Assigned chats", icon: UserCheck },
  { href: "/chats/unassigned", label: "Unassigned", icon: Users },
  { href: "/chats/history", label: "History", icon: Clock3 },
  { href: "/notifications", label: "Notifications", icon: Bell, unread: true },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavTooltip({ label, show }: { label: string; show: boolean }) {
  if (!show) return null;
  return (
    <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[60] -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0a275f] px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover/nav:opacity-100">
      {label}
      <span className="absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#0a275f]" />
    </span>
  );
}

function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const pending = usePortalStore(
    (state) =>
      state.conversations.filter((conversation) => conversation.status === "Pending")
        .length,
  );
  const unread = usePortalStore(
    (state) => state.notifications.filter((item) => !item.read).length,
  );
  const [hovered, setHovered] = useState(false);
  const expanded = mobile || hovered;

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/chats/live" && pathname.startsWith("/chats/live/")) ||
    (href === "/chats/history" && pathname.startsWith("/chats/history/"));

  return (
    <aside
      onMouseEnter={() => !mobile && setHovered(true)}
      onMouseLeave={() => !mobile && setHovered(false)}
      className={cn(
        "relative z-40 flex h-full flex-col bg-[#0a275f] text-white shadow-[4px_0_24px_rgba(10,39,95,.18)] transition-[width] duration-300 ease-out",
        mobile ? "w-[280px]" : expanded ? "w-[248px]" : "w-[76px]",
      )}
    >
      <div
        className={cn(
          "flex h-[72px] items-center border-b border-white/10",
          expanded ? "px-4" : "justify-center px-2",
        )}
      >
        <StusBrand compact={!expanded} light />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2.5 py-4" aria-label="Portal navigation">
        {navItems.map(({ href, label, icon: Icon, count, unread: isUnread }) => {
          const active = isActive(href);
          const badge = count ? pending : isUnread ? unread : 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group/nav relative flex h-11 items-center rounded-xl text-[13px] font-semibold transition",
                expanded ? "gap-3 px-3" : "justify-center px-0",
                active
                  ? "bg-white text-[#0a275f] shadow-[0_8px_20px_rgba(0,0,0,.18)]"
                  : "text-[#c6dbf0] hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={18} className="shrink-0" strokeWidth={active ? 2.25 : 2} />
              {expanded && <span className="flex-1 truncate">{label}</span>}
              {expanded && badge > 0 && (
                <span
                  className={cn(
                    "grid min-w-[22px] place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-[#0a275f] text-white" : "bg-[#c7d66d] text-[#26320b]",
                  )}
                >
                  {badge}
                </span>
              )}
              {!expanded && badge > 0 && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#c7d66d] ring-2 ring-[#0a275f]" />
              )}
              <NavTooltip label={label} show={!expanded} />
            </Link>
          );
        })}
      </nav>

      {!mobile && (
        <div className="border-t border-white/10 p-2.5">
          <div
            className={cn(
              "group/nav relative flex h-10 items-center rounded-xl text-[12px] font-semibold text-[#c6dbf0]",
              expanded ? "gap-2 px-3" : "justify-center",
            )}
          >
            <PanelLeft size={16} className={cn("shrink-0 transition", expanded && "rotate-180")} />
            {expanded && <span>Hover to expand</span>}
            <NavTooltip label="Hover to expand menu" show={!expanded} />
          </div>
        </div>
      )}
    </aside>
  );
}

function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const router = useRouter();
  const conversations = usePortalStore((state) => state.conversations);
  const notifications = usePortalStore((state) => state.notifications);
  const availability = usePortalStore((state) => state.availability);
  const setAvailability = usePortalStore((state) => state.setAvailability);
  const signOut = usePortalStore((state) => state.signOut);
  const resetDemo = usePortalStore((state) => state.resetDemo);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const unread = notifications.filter((item) => !item.read).length;
  const results = useMemo(
    () =>
      query.trim().length > 1
        ? conversations
            .filter((conversation) =>
              `${conversation.id} ${conversation.customer.name} ${conversation.customer.company}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .slice(0, 4)
        : [],
    [conversations, query],
  );

  return (
    <header className="relative z-30 flex h-[64px] items-center gap-3 border-b border-[#e4ecf4] bg-white/90 px-4 backdrop-blur-md lg:px-5">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
        className="lg:hidden"
        onClick={onOpenMenu}
      >
        <Menu size={21} />
      </Button>

      <div className="relative hidden min-w-0 flex-1 md:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-10 w-full rounded-xl border border-transparent bg-[#f1f5f9] pl-10 pr-4 text-[13px] text-[#0a275f] outline-none transition placeholder:text-slate-400 hover:bg-[#eef2f7] focus:border-[#013f92]/25 focus:bg-white focus:ring-4 focus:ring-[#013f92]/08"
          placeholder="Search customer, company or conversation ID"
          aria-label="Search conversations"
        />
        {results.length > 0 && (
          <Card className="absolute left-0 top-11 z-40 w-full max-w-xl overflow-hidden p-2 shadow-xl">
            {results.map((conversation) => (
              <button
                key={conversation.id}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left hover:bg-blue-50"
                onClick={() => {
                  router.push(`/chats/live/${conversation.id}`);
                  setQuery("");
                }}
              >
                <Avatar name={conversation.customer.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#0a275f]">
                    {conversation.customer.name}
                  </span>
                  <span className="block truncate text-xs text-stus-muted">
                    {conversation.id} · {conversation.reason}
                  </span>
                </span>
                <Badge tone="blue">{conversation.status}</Badge>
              </button>
            ))}
          </Card>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <label className="relative hidden sm:block">
          <span className="sr-only">Availability</span>
          <span
            className={cn(
              "absolute left-3 top-1/2 size-2 -translate-y-1/2 rounded-full",
              availability === "Online"
                ? "bg-emerald-500"
                : availability === "Away"
                  ? "bg-amber-500"
                  : "bg-slate-400",
            )}
          />
          <select
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value as "Online" | "Away" | "Offline")
            }
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[#e4ecf4] bg-white py-0 pl-7 pr-8 text-[12.5px] font-semibold text-[#0a275f] outline-none"
          >
            <option>Online</option>
            <option>Away</option>
            <option>Offline</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        </label>

        <div className="relative">
          <button
            type="button"
            aria-label={`${unread} unread notifications`}
            onClick={() => {
              setNotificationOpen((value) => !value);
              setProfileOpen(false);
            }}
            className="relative grid size-9 cursor-pointer place-items-center rounded-lg text-[#0a275f] transition hover:bg-[#f1f5f9]"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-red-500" />
            )}
          </button>
          {notificationOpen && (
            <Card className="absolute right-0 top-11 w-[min(340px,calc(100vw-2rem))] overflow-hidden shadow-xl">
              <div className="flex items-center justify-between border-b border-stus-border p-4">
                <span className="font-extrabold text-[#0a275f]">Notifications</span>
                <Link
                  href="/notifications"
                  className="text-xs font-bold text-[#013f92]"
                  onClick={() => setNotificationOpen(false)}
                >
                  View all
                </Link>
              </div>
              <div className="p-2">
                {notifications.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-xl p-3 hover:bg-blue-50">
                    <div className="flex gap-2">
                      {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#013f92]" />}
                      <div>
                        <p className="text-sm font-bold text-[#0a275f]">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-stus-muted">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((value) => !value);
              setNotificationOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-[#f1f5f9]"
            aria-label="Open profile menu"
          >
            <Avatar name="Ayesha Khan" size="sm" online />
            <span className="hidden text-left xl:block">
              <span className="block text-[13px] font-bold text-[#0a275f]">Ayesha Khan</span>
              <span className="block text-[10px] font-medium text-slate-400">Super Admin</span>
            </span>
            <ChevronDown size={14} className="hidden text-slate-400 xl:block" />
          </button>
          {profileOpen && (
            <Card className="absolute right-0 top-11 w-56 p-2 shadow-xl">
              <button
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-sm font-bold text-[#0a275f] hover:bg-blue-50"
                onClick={() => {
                  resetDemo();
                  setProfileOpen(false);
                }}
              >
                <RotateCcw size={17} /> Reset demo data
              </button>
              <button
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-sm font-bold text-red-600 hover:bg-red-50"
                onClick={() => {
                  signOut();
                  router.replace("/login");
                }}
              >
                <LogOut size={17} /> Sign out
              </button>
            </Card>
          )}
        </div>
      </div>
    </header>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const authenticated = usePortalStore((state) => state.authenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !authenticated) router.replace("/login");
  }, [authenticated, hydrated, router]);

  if (!hydrated || !authenticated) {
    return (
      <div className="flex min-h-dvh">
        <div className="hidden w-[76px] bg-[#0a275f] lg:block" />
        <div className="flex-1 bg-[#f5f7fb] p-5">
          <Skeleton className="h-14 w-full" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f5f7fb]">
      <div className="hidden shrink-0 lg:block">
        <Sidebar />
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/45 lg:hidden">
          <Sidebar mobile onNavigate={() => setMenuOpen(false)} />
          <button
            aria-label="Close navigation"
            className="m-4 grid size-11 cursor-pointer place-items-center rounded-xl bg-white text-[#0a275f]"
            onClick={() => setMenuOpen(false)}
          >
            <X size={21} />
          </button>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="relative min-h-0 flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#e4ecf4] bg-white px-2 py-2 lg:hidden">
        {[
          { href: "/chats/requests", label: "Requests", icon: Inbox },
          { href: "/chats/live", label: "Chats", icon: MessageCircle },
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/notifications", label: "Alerts", icon: Bell },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-bold text-stus-muted"
          >
            <Icon size={19} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#013f92]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-black tracking-[-0.03em] text-[#0a275f] md:text-[1.85rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stus-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

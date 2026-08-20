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
  PanelLeftClose,
  RotateCcw,
  Search,
  Settings,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { StusBrand } from "@/components/brand";
import { Avatar, Badge, Button, Card, Input, Skeleton } from "@/components/ui";
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
];

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-[#072f67] text-white transition-[width] duration-200",
        mobile ? "w-[286px]" : collapsed ? "w-[88px]" : "w-[260px]",
      )}
    >
      <div className="flex h-20 items-center border-b border-white/10 px-5">
        <StusBrand compact={collapsed && !mobile} light />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Portal navigation">
        {navItems.map(({ href, label, icon: Icon, count, unread: isUnread }) => {
          const active =
            pathname === href ||
            (href === "/chats/live" && pathname.startsWith("/chats/live/"));
          const badge = count ? pending : isUnread ? unread : 0;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={cn(
                "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition",
                active
                  ? "bg-white text-primary shadow-sm"
                  : "text-blue-100 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={19} className="shrink-0" />
              {(!collapsed || mobile) && <span className="flex-1">{label}</span>}
              {badge > 0 && (!collapsed || mobile) && (
                <span
                  className={cn(
                    "grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-primary text-white" : "bg-[#c7d66d] text-[#26320b]",
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="my-4 border-t border-white/10" />
        <span className="flex h-11 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-bold text-blue-200/55">
          <BarChart3 size={19} />
          {(!collapsed || mobile) && "Analytics"}
        </span>
        <span className="flex h-11 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-bold text-blue-200/55">
          <Settings size={19} />
          {(!collapsed || mobile) && "Settings"}
        </span>
      </nav>
      {!mobile && (
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="m-3 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-bold text-blue-100 hover:bg-white/10"
        >
          <PanelLeftClose
            size={18}
            className={cn("transition", collapsed && "rotate-180")}
          />
          {!collapsed && "Collapse"}
        </button>
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
    <header className="relative z-30 flex h-20 items-center gap-3 border-b border-stus-border bg-white/95 px-4 backdrop-blur lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
        className="lg:hidden"
        onClick={onOpenMenu}
      >
        <Menu size={21} />
      </Button>
      <div className="relative hidden max-w-lg flex-1 md:block">
        <Search className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" size={17} />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-10"
          placeholder="Search customer, company or conversation ID"
          aria-label="Search conversations"
        />
        {results.length > 0 && (
          <Card className="absolute left-0 right-0 top-12 overflow-hidden p-2">
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
                  <span className="block truncate text-sm font-bold">{conversation.customer.name}</span>
                  <span className="block truncate text-xs text-stus-muted">{conversation.id} · {conversation.reason}</span>
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
              "absolute left-3 top-3.5 size-2.5 rounded-full",
              availability === "Online"
                ? "bg-green-500"
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
            className="h-11 cursor-pointer appearance-none rounded-xl border border-stus-border bg-white py-0 pl-8 pr-8 text-sm font-bold text-stus-dark"
          >
            <option>Online</option>
            <option>Away</option>
            <option>Offline</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-3.5 text-stus-muted" size={16} />
        </label>
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            aria-label={`${unread} unread notifications`}
            onClick={() => setNotificationOpen((value) => !value)}
          >
            <Bell size={19} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 size-2.5 rounded-full border-2 border-white bg-red-500" />
            )}
          </Button>
          {notificationOpen && (
            <Card className="absolute right-0 top-13 w-[min(360px,calc(100vw-2rem))] overflow-hidden">
              <div className="flex items-center justify-between border-b border-stus-border p-4">
                <span className="font-extrabold">Notifications</span>
                <Link href="/notifications" className="text-xs font-bold text-primary" onClick={() => setNotificationOpen(false)}>
                  View all
                </Link>
              </div>
              <div className="p-2">
                {notifications.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-xl p-3 hover:bg-blue-50">
                    <div className="flex gap-2">
                      {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                      <div>
                        <p className="text-sm font-bold">{item.title}</p>
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
            onClick={() => setProfileOpen((value) => !value)}
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1.5 hover:bg-blue-50"
            aria-label="Open profile menu"
          >
            <Avatar name="Ayesha Khan" size="sm" online />
            <span className="hidden text-left xl:block">
              <span className="block text-sm font-extrabold">Ayesha Khan</span>
              <span className="block text-[11px] text-stus-muted">Super Admin</span>
            </span>
            <ChevronDown size={16} className="hidden text-stus-muted xl:block" />
          </button>
          {profileOpen && (
            <Card className="absolute right-0 top-13 w-56 p-2">
              <button
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-sm font-bold hover:bg-blue-50"
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
        <div className="hidden w-64 bg-[#072f67] lg:block" />
        <div className="flex-1 p-6">
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
    <div className="flex h-dvh overflow-hidden">
      <div className="hidden shrink-0 lg:block">
        <Sidebar />
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/45 lg:hidden">
          <Sidebar mobile onNavigate={() => setMenuOpen(false)} />
          <button
            aria-label="Close navigation"
            className="m-4 grid size-11 cursor-pointer place-items-center rounded-xl bg-white text-stus-dark"
            onClick={() => setMenuOpen(false)}
          >
            <X size={21} />
          </button>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-stus-border bg-white px-2 py-2 lg:hidden">
        {[
          { href: "/chats/requests", label: "Requests", icon: Inbox },
          { href: "/chats/live", label: "Chats", icon: MessageCircle },
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/notifications", label: "Alerts", icon: Bell },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-bold text-stus-muted">
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
          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-black tracking-[-0.03em] text-stus-dark md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stus-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  Check,
  MessageSquareText,
  Play,
  Route,
  Shield,
  Timer,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/layout/portal-shell";
import { Avatar, Button, Card } from "@/components/ui";
import {
  previewSound,
  RECEIVE_SOUND_OPTIONS,
  SEND_SOUND_OPTIONS,
  TYPING_SOUND_OPTIONS,
  type ReceiveSoundId,
  type SendSoundId,
  type TypingSoundId,
} from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { usePortalStore, defaultSettings } from "@/stores/portal-store";
import type { PortalSettings, Priority } from "@/types";

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "chat", label: "Chat preferences", icon: MessageSquareText },
  { id: "routing", label: "Routing & SLA", icon: Route },
  { id: "security", label: "Security", icon: Shield },
] as const;

type SectionId = (typeof sections)[number]["id"];

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-[13px] font-semibold text-[#0a275f]">{label}</p>
        <p className="mt-0.5 text-[12px] leading-5 text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition",
          checked ? "bg-[#013f92]" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-[#e2eaf3] bg-white px-3 text-[13px] text-[#0a275f] outline-none transition focus:border-[#013f92]/40 focus:ring-2 focus:ring-[#013f92]/10";

export function SettingsView() {
  const settings = usePortalStore((state) => state.settings);
  const availability = usePortalStore((state) => state.availability);
  const setAvailability = usePortalStore((state) => state.setAvailability);
  const updateSettings = usePortalStore((state) => state.updateSettings);
  const [section, setSection] = useState<SectionId>("profile");
  const [draft, setDraft] = useState<PortalSettings>({
    ...defaultSettings,
    ...settings,
  });
  const [saved, setSaved] = useState(false);

  const patch = <K extends keyof PortalSettings>(
    key: K,
    value: PortalSettings[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    updateSettings(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage your profile, alerts, chat behavior, and queue SLAs for the STUS support portal."
        action={
          <Button onClick={save} className="min-w-[120px]">
            {saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        }
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="h-fit p-2">
          <nav className="space-y-0.5" aria-label="Settings sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition",
                  section === id
                    ? "bg-[#eef4ff] text-[#013f92]"
                    : "text-slate-500 hover:bg-[#f7f9fc] hover:text-[#0a275f]",
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="space-y-5">
          {section === "profile" && (
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-4 border-b border-[#eef2f7] pb-5">
                <Avatar name={draft.displayName} size="lg" online />
                <div>
                  <h2 className="text-[15px] font-bold text-[#0a275f]">
                    Agent profile
                  </h2>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Shown to teammates and in chat transcripts
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Display name">
                  <input
                    className={inputClass}
                    value={draft.displayName}
                    onChange={(e) => patch("displayName", e.target.value)}
                  />
                </Field>
                <Field label="Work email">
                  <input
                    className={inputClass}
                    type="email"
                    value={draft.email}
                    onChange={(e) => patch("email", e.target.value)}
                  />
                </Field>
                <Field label="Role">
                  <input className={inputClass} value={draft.roleLabel} disabled />
                </Field>
                <Field label="Availability">
                  <select
                    className={inputClass}
                    value={availability}
                    onChange={(e) =>
                      setAvailability(
                        e.target.value as "Online" | "Away" | "Offline",
                      )
                    }
                  >
                    <option>Online</option>
                    <option>Away</option>
                    <option>Offline</option>
                  </select>
                </Field>
                <Field label="Language">
                  <select
                    className={inputClass}
                    value={draft.language}
                    onChange={(e) => patch("language", e.target.value)}
                  >
                    <option>English</option>
                    <option>Urdu</option>
                  </select>
                </Field>
                <Field label="Timezone">
                  <select
                    className={inputClass}
                    value={draft.timezone}
                    onChange={(e) => patch("timezone", e.target.value)}
                  >
                    <option>Asia/Karachi (PKT)</option>
                    <option>UTC</option>
                    <option>Asia/Dubai (GST)</option>
                  </select>
                </Field>
              </div>
            </Card>
          )}

          {section === "notifications" && (
            <div className="space-y-5">
              <Card className="divide-y divide-[#eef2f7] px-5 py-2 sm:px-6">
                <div className="py-4">
                  <h2 className="text-[15px] font-bold text-[#0a275f]">
                    Notification preferences
                  </h2>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Control how you get alerted for new requests and messages
                  </p>
                </div>
                <Toggle
                  checked={draft.soundNotifications}
                  onChange={(v) => patch("soundNotifications", v)}
                  label="Sound alerts"
                  description="Master switch for send, receive, and typing sounds"
                />
                <Toggle
                  checked={draft.desktopNotifications}
                  onChange={(v) => patch("desktopNotifications", v)}
                  label="Desktop notifications"
                  description="Show browser notifications while the portal is open"
                />
                <Toggle
                  checked={draft.emailDigest}
                  onChange={(v) => patch("emailDigest", v)}
                  label="Daily email digest"
                  description="Receive a morning summary of queue health and unresolved chats"
                />
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="text-[15px] font-bold text-[#0a275f]">
                  Message sounds
                </h2>
                <p className="mt-1 text-[12px] text-slate-500">
                  Dropdown se sound choose karo, Play se suno, phir Save changes
                  dabao
                </p>

                <div className="mt-5 space-y-4">
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Field label="Send message sound">
                      <select
                        className={inputClass}
                        value={draft.sendSound}
                        onChange={(e) =>
                          patch("sendSound", e.target.value as SendSoundId)
                        }
                      >
                        {SEND_SOUND_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <button
                      type="button"
                      onClick={() => previewSound("send", draft.sendSound)}
                      className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e2eaf3] bg-white px-4 text-[12px] font-semibold text-[#0a275f] hover:bg-[#f7f9fc]"
                    >
                      <Play size={14} /> Play
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Field label="New message received sound">
                      <select
                        className={inputClass}
                        value={draft.receiveSound}
                        onChange={(e) =>
                          patch("receiveSound", e.target.value as ReceiveSoundId)
                        }
                      >
                        {RECEIVE_SOUND_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <button
                      type="button"
                      onClick={() => previewSound("receive", draft.receiveSound)}
                      className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e2eaf3] bg-white px-4 text-[12px] font-semibold text-[#0a275f] hover:bg-[#f7f9fc]"
                    >
                      <Play size={14} /> Play
                    </button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Field label="Typing sound">
                      <select
                        className={inputClass}
                        value={draft.typingSound}
                        onChange={(e) =>
                          patch("typingSound", e.target.value as TypingSoundId)
                        }
                      >
                        {TYPING_SOUND_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <button
                      type="button"
                      disabled={draft.typingSound === "off"}
                      onClick={() => previewSound("typing", draft.typingSound)}
                      className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e2eaf3] bg-white px-4 text-[12px] font-semibold text-[#0a275f] hover:bg-[#f7f9fc] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Play size={14} /> Play
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-slate-400">
                  Sound alerts toggle ON hona chahiye. Select → Play → Save
                  changes.
                </p>
              </Card>
            </div>
          )}

          {section === "chat" && (
            <Card className="p-5 sm:p-6">
              <h2 className="text-[15px] font-bold text-[#0a275f]">
                Chat preferences
              </h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Defaults for how you reply in live conversations
              </p>
              <div className="mt-2 divide-y divide-[#eef2f7]">
                <Toggle
                  checked={draft.enterToSend}
                  onChange={(v) => patch("enterToSend", v)}
                  label="Enter to send"
                  description="Press Enter to send · Shift+Enter for a new line"
                />
                <Toggle
                  checked={draft.showTypingIndicator}
                  onChange={(v) => patch("showTypingIndicator", v)}
                  label="Show typing indicator"
                  description="Let customers see when you are composing a reply"
                />
              </div>
              <div className="mt-4">
                <Field label="Reply signature">
                  <textarea
                    rows={4}
                    className={cn(inputClass, "h-auto min-h-[96px] py-2.5")}
                    value={draft.chatSignature}
                    onChange={(e) => patch("chatSignature", e.target.value)}
                  />
                </Field>
              </div>
            </Card>
          )}

          {section === "routing" && (
            <Card className="p-5 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#eef4ff] text-[#013f92]">
                  <Timer size={18} />
                </span>
                <div>
                  <h2 className="text-[15px] font-bold text-[#0a275f]">
                    Routing & SLA
                  </h2>
                  <p className="mt-1 text-[12px] leading-5 text-slate-500">
                    Define capacity limits and service targets used by Analytics
                    and the live queue
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#eef2f7]">
                <Toggle
                  checked={draft.autoAssignEnabled}
                  onChange={(v) => patch("autoAssignEnabled", v)}
                  label="Auto-assign new chats"
                  description="Route pending requests to available agents under their max load"
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Max concurrent chats">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className={inputClass}
                    value={draft.maxConcurrentChats}
                    onChange={(e) =>
                      patch("maxConcurrentChats", Number(e.target.value) || 1)
                    }
                  />
                </Field>
                <Field label="Default priority">
                  <select
                    className={inputClass}
                    value={draft.defaultPriority}
                    onChange={(e) =>
                      patch("defaultPriority", e.target.value as Priority)
                    }
                  >
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </Field>
                <Field label="First response SLA (minutes)">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    className={inputClass}
                    value={draft.slaFirstResponseMinutes}
                    onChange={(e) =>
                      patch(
                        "slaFirstResponseMinutes",
                        Number(e.target.value) || 1,
                      )
                    }
                  />
                </Field>
                <Field label="Resolution SLA (hours)">
                  <input
                    type="number"
                    min={1}
                    max={168}
                    className={inputClass}
                    value={draft.slaResolutionHours}
                    onChange={(e) =>
                      patch("slaResolutionHours", Number(e.target.value) || 1)
                    }
                  />
                </Field>
              </div>
            </Card>
          )}

          {section === "security" && (
            <Card className="p-5 sm:p-6">
              <h2 className="text-[15px] font-bold text-[#0a275f]">Security</h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Session and access controls for this demo workspace
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-[#e8eef5] bg-[#fafbfd] p-4">
                  <p className="text-[13px] font-semibold text-[#0a275f]">
                    Active session
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Signed in as {draft.email} · {draft.roleLabel}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e8eef5] p-4">
                  <p className="text-[13px] font-semibold text-[#0a275f]">
                    Two-factor authentication
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Recommended for Super Admin accounts (demo placeholder)
                  </p>
                  <Button variant="secondary" className="mt-3" disabled>
                    Enable 2FA
                  </Button>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <p className="text-[13px] font-semibold text-red-700">
                    Danger zone
                  </p>
                  <p className="mt-1 text-[12px] text-red-600/80">
                    Resetting demo data clears chats and notifications from this
                    browser
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

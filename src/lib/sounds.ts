/** Reliable UI sounds via short generated WAV + HTMLAudioElement. */

export type SendSoundId = "whatsapp" | "pop" | "bubble" | "click" | "chime";
export type ReceiveSoundId = "ping" | "chime" | "soft" | "alert";
export type TypingSoundId = "off" | "tick" | "soft" | "typewriter";

export const SEND_SOUND_OPTIONS: { id: SendSoundId; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp send" },
  { id: "pop", label: "Pop" },
  { id: "bubble", label: "Bubble" },
  { id: "click", label: "Click" },
  { id: "chime", label: "Chime" },
];

export const RECEIVE_SOUND_OPTIONS: { id: ReceiveSoundId; label: string }[] = [
  { id: "ping", label: "Ping" },
  { id: "chime", label: "Chime" },
  { id: "soft", label: "Soft" },
  { id: "alert", label: "Alert" },
];

export const TYPING_SOUND_OPTIONS: { id: TypingSoundId; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "tick", label: "Tick" },
  { id: "soft", label: "Soft" },
  { id: "typewriter", label: "Typewriter" },
];

type Note = { f: number; start: number; dur: number; vol?: number };

function encodeWav(notes: Note[], sampleRate = 22050): string {
  let duration = 0.05;
  for (const n of notes) duration = Math.max(duration, n.start + n.dur + 0.04);
  const length = Math.floor(sampleRate * duration);
  const samples = new Float32Array(length);

  for (const note of notes) {
    const vol = note.vol ?? 0.45;
    const start = Math.floor(note.start * sampleRate);
    const end = Math.min(
      length,
      Math.floor((note.start + note.dur) * sampleRate),
    );
    for (let i = start; i < end; i++) {
      const t = (i - start) / sampleRate;
      const env = Math.exp((-5 * t) / Math.max(note.dur, 0.02));
      samples[i] += Math.sin(2 * Math.PI * note.f * t) * vol * env;
    }
  }

  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.max(-1, Math.min(1, samples[i]));
  }

  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, length * 2, true);

  let offset = 44;
  for (let i = 0; i < length; i++, offset += 2) {
    view.setInt16(offset, samples[i] * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

const cache = new Map<string, string>();

function wav(key: string, notes: Note[]) {
  let url = cache.get(key);
  if (!url) {
    url = encodeWav(notes);
    cache.set(key, url);
  }
  return url;
}

function getSendWav(id: SendSoundId) {
  switch (id) {
    case "whatsapp":
      return wav("send-whatsapp", [
        { f: 620, start: 0, dur: 0.07, vol: 0.55 },
        { f: 920, start: 0.05, dur: 0.11, vol: 0.48 },
      ]);
    case "pop":
      return wav("send-pop", [
        { f: 480, start: 0, dur: 0.05, vol: 0.6 },
        { f: 760, start: 0.03, dur: 0.09, vol: 0.4 },
      ]);
    case "bubble":
      return wav("send-bubble", [
        { f: 360, start: 0, dur: 0.1, vol: 0.5 },
        { f: 560, start: 0.07, dur: 0.12, vol: 0.38 },
      ]);
    case "click":
      return wav("send-click", [{ f: 1400, start: 0, dur: 0.04, vol: 0.5 }]);
    case "chime":
      return wav("send-chime", [
        { f: 660, start: 0, dur: 0.1, vol: 0.45 },
        { f: 990, start: 0.1, dur: 0.14, vol: 0.4 },
      ]);
  }
}

function getReceiveWav(id: ReceiveSoundId) {
  switch (id) {
    case "ping":
      return wav("recv-ping", [
        { f: 780, start: 0, dur: 0.1, vol: 0.5 },
        { f: 1040, start: 0.11, dur: 0.15, vol: 0.42 },
      ]);
    case "chime":
      return wav("recv-chime", [
        { f: 523, start: 0, dur: 0.12, vol: 0.42 },
        { f: 659, start: 0.12, dur: 0.12, vol: 0.4 },
        { f: 784, start: 0.24, dur: 0.16, vol: 0.35 },
      ]);
    case "soft":
      return wav("recv-soft", [
        { f: 480, start: 0, dur: 0.16, vol: 0.35 },
        { f: 620, start: 0.1, dur: 0.18, vol: 0.28 },
      ]);
    case "alert":
      return wav("recv-alert", [
        { f: 900, start: 0, dur: 0.08, vol: 0.5 },
        { f: 900, start: 0.12, dur: 0.08, vol: 0.45 },
      ]);
  }
}

function getTypingWav(id: Exclude<TypingSoundId, "off">) {
  switch (id) {
    case "tick":
      return wav("type-tick", [{ f: 1500, start: 0, dur: 0.025, vol: 0.22 }]);
    case "soft":
      return wav("type-soft", [{ f: 980, start: 0, dur: 0.03, vol: 0.14 }]);
    case "typewriter":
      return wav("type-tw", [
        { f: 720, start: 0, dur: 0.03, vol: 0.28 },
        { f: 420, start: 0.015, dur: 0.03, vol: 0.16 },
      ]);
  }
}

function playUrl(url: string, volume = 0.95) {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(url);
    audio.volume = Math.min(1, Math.max(0, volume));
    void audio.play().catch(() => undefined);
  } catch {
    // ignore
  }
}

export function unlockAudio() {
  playUrl(wav("unlock", [{ f: 440, start: 0, dur: 0.015, vol: 0.001 }]), 0.01);
}

export function playSendSound(
  enabled = true,
  preset: SendSoundId = "whatsapp",
) {
  if (!enabled) return;
  playUrl(getSendWav(preset), 1);
}

export function playReceiveSound(
  enabled = true,
  preset: ReceiveSoundId = "ping",
) {
  if (!enabled) return;
  playUrl(getReceiveWav(preset), 1);
}

let lastTypingAt = 0;

export function playTypingSound(
  enabled = true,
  preset: TypingSoundId = "tick",
) {
  if (!enabled || preset === "off") return;
  const now = Date.now();
  if (now - lastTypingAt < 50) return;
  lastTypingAt = now;
  playUrl(getTypingWav(preset), 0.75);
}

export function previewSound(
  kind: "send" | "receive" | "typing",
  id: string,
) {
  if (kind === "send") playSendSound(true, id as SendSoundId);
  else if (kind === "receive") playReceiveSound(true, id as ReceiveSoundId);
  else if (id !== "off") playTypingSound(true, id as TypingSoundId);
}

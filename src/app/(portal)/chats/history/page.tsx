import type { Metadata } from "next";
import { HistoryView } from "@/components/chat/history-view";

export const metadata: Metadata = { title: "Chat history" };

export default function ChatHistoryPage() {
  return <HistoryView />;
}

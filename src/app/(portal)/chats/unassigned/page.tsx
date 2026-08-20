import type { Metadata } from "next";
import { QueueView } from "@/components/chat/queue-view";

export const metadata: Metadata = { title: "Unassigned chats" };

export default function UnassignedChatsPage() {
  return <QueueView mode="unassigned" />;
}

import type { Metadata } from "next";
import { QueueView } from "@/components/chat/queue-view";

export const metadata: Metadata = { title: "Assigned chats" };

export default function AssignedChatsPage() {
  return <QueueView mode="assigned" />;
}

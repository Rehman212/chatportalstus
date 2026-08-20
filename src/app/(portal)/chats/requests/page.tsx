import type { Metadata } from "next";
import { QueueView } from "@/components/chat/queue-view";

export const metadata: Metadata = { title: "Chat requests" };

export default function ChatRequestsPage() {
  return <QueueView mode="requests" />;
}

import type { Metadata } from "next";
import { HistoryDetail } from "@/components/chat/history-view";

export const metadata: Metadata = { title: "Conversation history" };

export default async function ConversationHistoryPage(props: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await props.params;
  return <HistoryDetail conversationId={conversationId} />;
}

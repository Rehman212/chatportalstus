import type { Metadata } from "next";
import { LiveChatView } from "@/components/chat/live-chat-view";

export const metadata: Metadata = { title: "Live conversation" };

export default async function LiveConversationPage(props: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await props.params;
  return <LiveChatView selectedId={conversationId} />;
}

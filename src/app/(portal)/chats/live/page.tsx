import type { Metadata } from "next";
import {
  LiveChatView,
  MobileConversationIndex,
} from "@/components/chat/live-chat-view";

export const metadata: Metadata = { title: "Live chats" };

export default function LiveChatsPage() {
  return (
    <>
      <MobileConversationIndex />
      <div className="hidden md:block">
        <LiveChatView />
      </div>
    </>
  );
}

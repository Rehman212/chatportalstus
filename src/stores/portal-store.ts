"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { agents, conversations, notifications } from "@/lib/mock-data";
import type {
  Availability,
  Conversation,
  ConversationStatus,
  PortalNotification,
  Priority,
} from "@/types";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

interface PortalState {
  authenticated: boolean;
  userName: string;
  availability: Availability;
  conversations: Conversation[];
  notifications: PortalNotification[];
  signIn: (email: string) => void;
  signOut: () => void;
  setAvailability: (availability: Availability) => void;
  acceptConversation: (id: string) => void;
  rejectConversation: (id: string) => void;
  assignConversation: (id: string, agentName: string) => void;
  setPriority: (id: string, priority: Priority) => void;
  setStatus: (id: string, status: ConversationStatus) => void;
  sendMessage: (id: string, body: string) => void;
  retryMessage: (conversationId: string, messageId: string) => void;
  addNote: (id: string, body: string) => void;
  closeConversation: (id: string, note?: string) => void;
  markConversationRead: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  resetDemo: () => void;
}

const updateConversation = (
  items: Conversation[],
  id: string,
  update: (item: Conversation) => Conversation,
) => items.map((item) => (item.id === id ? update(item) : item));

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      authenticated: false,
      userName: "Ayesha Khan",
      availability: "Online",
      conversations: clone(conversations),
      notifications: clone(notifications),
      signIn: () => set({ authenticated: true }),
      signOut: () => set({ authenticated: false }),
      setAvailability: (availability) => set({ availability }),
      acceptConversation: (id) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              assignedAgent: state.userName,
              status: "Active",
              unread: 0,
              updatedAt: new Date().toISOString(),
            }),
          ),
        })),
      rejectConversation: (id) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              status: "Rejected",
              unread: 0,
              updatedAt: new Date().toISOString(),
            }),
          ),
        })),
      assignConversation: (id, agentName) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              assignedAgent: agentName,
              status:
                conversation.status === "Pending"
                  ? "Assigned"
                  : conversation.status,
              updatedAt: new Date().toISOString(),
            }),
          ),
        })),
      setPriority: (id, priority) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({ ...conversation, priority }),
          ),
        })),
      setStatus: (id, status) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              status,
              updatedAt: new Date().toISOString(),
            }),
          ),
        })),
      sendMessage: (id, body) => {
        const messageId = `local-${Date.now()}`;
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              status:
                conversation.status === "Assigned"
                  ? "Active"
                  : conversation.status,
              updatedAt: new Date().toISOString(),
              messages: [
                ...conversation.messages,
                {
                  id: messageId,
                  conversationId: id,
                  sender: state.userName,
                  kind: "agent",
                  body,
                  createdAt: new Date().toISOString(),
                  delivery: "sending",
                },
              ],
            }),
          ),
        }));
        window.setTimeout(() => {
          set((state) => ({
            conversations: updateConversation(
              state.conversations,
              id,
              (conversation) => ({
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === messageId
                    ? { ...message, delivery: "sent" as const }
                    : message,
                ),
              }),
            ),
          }));
        }, 650);
      },
      retryMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            conversationId,
            (conversation) => ({
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId
                  ? { ...message, delivery: "sending" as const }
                  : message,
              ),
            }),
          ),
        }));
        window.setTimeout(() => {
          set((state) => ({
            conversations: updateConversation(
              state.conversations,
              conversationId,
              (conversation) => ({
                ...conversation,
                messages: conversation.messages.map((message) =>
                  message.id === messageId
                    ? { ...message, delivery: "sent" as const }
                    : message,
                ),
              }),
            ),
          }));
        }, 500);
      },
      addNote: (id, body) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: `note-${Date.now()}`,
                  conversationId: id,
                  sender: state.userName,
                  kind: "note",
                  body,
                  createdAt: new Date().toISOString(),
                  delivery: "sent",
                },
              ],
            }),
          ),
        })),
      closeConversation: (id, note) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({
              ...conversation,
              status: "Closed",
              closedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              messages: note
                ? [
                    ...conversation.messages,
                    {
                      id: `close-${Date.now()}`,
                      conversationId: id,
                      sender: state.userName,
                      kind: "note",
                      body: `Closing note: ${note}`,
                      createdAt: new Date().toISOString(),
                      delivery: "sent",
                    },
                  ]
                : conversation.messages,
            }),
          ),
        })),
      markConversationRead: (id) =>
        set((state) => ({
          conversations: updateConversation(
            state.conversations,
            id,
            (conversation) => ({ ...conversation, unread: 0 }),
          ),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification,
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id,
          ),
        })),
      resetDemo: () =>
        set({
          availability: agents[0].availability,
          conversations: clone(conversations),
          notifications: clone(notifications),
        }),
    }),
    {
      name: "stus-support-demo",
      partialize: (state) => ({
        authenticated: state.authenticated,
        availability: state.availability,
        conversations: state.conversations,
        notifications: state.notifications,
      }),
    },
  ),
);

export function useStoreHydrated() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

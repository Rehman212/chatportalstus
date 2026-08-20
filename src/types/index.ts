export type UserType = "Buyer" | "Supplier";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type ConversationStatus =
  | "Pending"
  | "Assigned"
  | "Active"
  | "Waiting for User"
  | "Waiting for Agent"
  | "Resolved"
  | "Closed"
  | "Rejected";
export type Availability = "Online" | "Away" | "Offline";
export type MessageKind =
  | "agent"
  | "customer"
  | "bot"
  | "system"
  | "note";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: UserType;
  plan: string;
  online: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  kind: MessageKind;
  body: string;
  createdAt: string;
  delivery?: "sending" | "sent" | "failed";
  attachment?: { name: string; size: string };
}

export interface Conversation {
  id: string;
  customer: Customer;
  reason: string;
  product: string;
  status: ConversationStatus;
  priority: Priority;
  assignedAgent?: string;
  requestedAt: string;
  updatedAt: string;
  closedAt?: string;
  unread: number;
  firstResponseMinutes?: number;
  chatbotContext: Array<{ question: string; answer: string }>;
  messages: Message[];
}

export interface Agent {
  id: string;
  name: string;
  role: "Super Admin" | "Agent";
  availability: Availability;
  activeChats: number;
}

export interface PortalNotification {
  id: string;
  type: "request" | "message" | "assignment" | "closed" | "system";
  title: string;
  detail: string;
  conversationId?: string;
  createdAt: string;
  read: boolean;
}

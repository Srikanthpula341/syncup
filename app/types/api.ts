import { Attachment } from '@/app/store/slices/chatSlice';

// --- Messages ---
export interface SendMessageRequest {
  content: string;
  attachments: Attachment[];
  userId: string;
  userName: string;
  userAvatar: string;
  workspaceId: string | null;
  channelId: string | null;
}

export interface ReactMessageRequest {
  messageId: string;
  emoji: string;
  userId: string;
  workspaceId: string | null;
  channelId: string | null;
  action: 'ADD' | 'REMOVE';
}

export interface MarkReadRequest {
  channelId: string | null;
  userId: string;
  workspaceId: string | null;
}

export interface ReplyRequest {
  content: string;
  userId: string;
  userName: string;
  userAvatar: string;
  workspaceId: string | null;
  channelId: string | null;
  parentMessageId: string | null;
}

// --- Tasks ---
export interface CreateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: string | null;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string | { toMillis: () => number } | null;
  columnId?: string;
  workspaceId: string;
  creatorId: string;
}

export interface MoveTaskRequest {
  taskId: string;
  taskTitle: string;
  userId: string;
  workspaceId: string;
  newColumnId: string;
  oldColumnName: string;
  newColumnName: string;
}

export interface TaskCommentRequest {
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  workspaceId?: string;
}

// --- Presence ---
export interface HeartbeatRequest {
  userId: string;
}

// --- Workspaces ---
export interface UpdateWorkspaceRequest {
  workspaceId: string | null;
  userId: string;
  name: string;
}

// --- Notifications ---
export interface ManageNotificationRequest {
  userId: string;
  notificationId?: string;
  action: 'MARK_READ' | 'READ_ALL' | 'DELETE';
}

// --- Chat ---
export interface TypingRequest {
  channelId: string | null;
  userId: string;
  userName: string;
}

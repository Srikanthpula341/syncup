import { API_ROUTES } from './api-constants';
import * as Types from '@/app/types/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * A typed wrapper for fetch calls with standardized error handling
 * and automatic Firebase Auth token injection.
 */
async function request<T>(
  url: string,
  method: HttpMethod = 'POST',
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Inject Firebase ID Token for server-side verification
  try {
    const { auth } = await import('./firebase');
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Token injection is best-effort; the API will reject if auth is required
  }

  const options: RequestInit = {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message ||
      `API request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Domain-specific API services — typed end-to-end.
 */
export const api = {
  messages: {
    send:     (data: Types.SendMessageRequest) =>    request(API_ROUTES.MESSAGES.SEND,      'POST', data),
    react:    (data: Types.ReactMessageRequest) =>   request(API_ROUTES.MESSAGES.REACT,     'POST', data),
    markRead: (data: Types.MarkReadRequest) =>       request(API_ROUTES.MESSAGES.MARK_READ, 'POST', data),
    reply:    (data: Types.ReplyRequest) =>          request(API_ROUTES.MESSAGES.REPLY,     'POST', data),
  },
  tasks: {
    create:  (data: Types.CreateTaskRequest) =>      request(API_ROUTES.TASKS.CREATE,   'POST',  data),
    move:    (data: Types.MoveTaskRequest) =>        request(API_ROUTES.TASKS.MOVE,     'PATCH', data),
    comment: (data: Types.TaskCommentRequest) =>     request(API_ROUTES.TASKS.COMMENT,  'POST',  data),
  },
  presence: {
    heartbeat: (userId: string) => request(API_ROUTES.PRESENCE.HEARTBEAT, 'POST', { userId }),
  },
  workspaces: {
    update: (data: Types.UpdateWorkspaceRequest) =>  request(API_ROUTES.WORKSPACES.UPDATE,    'POST', data),
  },
  notifications: {
    manage: (data: Types.ManageNotificationRequest) => request(API_ROUTES.NOTIFICATIONS.MANAGE, 'POST', data),
  },
  chat: {
    typing: (data: Types.TypingRequest, isTyping: boolean) =>
      request(API_ROUTES.CHAT.TYPING, isTyping ? 'POST' : 'DELETE', data),
  },
};

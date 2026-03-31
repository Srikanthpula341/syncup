/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ROUTES } from './api-constants';
import * as Types from '@/app/types/api';

/**
 * A typed wrapper for fetch calls with standardized error handling.
 */
async function request<T>(
  url: string, 
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST', 
  body?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Domain-specific API services.
 */
export const api = {
  messages: {
    send: (data: Types.SendMessageRequest) => 
      request(API_ROUTES.MESSAGES.SEND, 'POST', data),
    react: (data: Types.ReactMessageRequest) => 
      request(API_ROUTES.MESSAGES.REACT, 'POST', data),
    markRead: (data: Types.MarkReadRequest) => 
      request(API_ROUTES.MESSAGES.MARK_READ, 'POST', data),
    reply: (data: Types.ReplyRequest) => 
      request(API_ROUTES.MESSAGES.REPLY, 'POST', data),
  },
  tasks: {
    create: (data: Types.CreateTaskRequest) => 
      request(API_ROUTES.TASKS.CREATE, 'POST', data),
    move: (data: Types.MoveTaskRequest) => 
      request(API_ROUTES.TASKS.MOVE, 'PATCH', data),
  },
  presence: {
    heartbeat: (userId: string) => 
      request(API_ROUTES.PRESENCE.HEARTBEAT, 'POST', { userId }),
  },
  workspaces: {
    update: (data: Types.UpdateWorkspaceRequest) => 
      request(API_ROUTES.WORKSPACES.UPDATE, 'POST', data),
  },
  notifications: {
    manage: (data: Types.ManageNotificationRequest) => 
      request(API_ROUTES.NOTIFICATIONS.MANAGE, 'POST', data),
  },
  chat: {
    typing: (data: Types.TypingRequest, isTyping: boolean) => 
      request(API_ROUTES.CHAT.TYPING, isTyping ? 'POST' : 'DELETE', data),
  }
};

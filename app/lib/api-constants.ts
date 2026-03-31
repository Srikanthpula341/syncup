export const API_ROUTES = {
  MESSAGES: {
    SEND: '/api/messages/send',
    REACT: '/api/messages/react',
    MARK_READ: '/api/messages/mark-read',
    REPLY: '/api/messages/reply',
  },
  TASKS: {
    CREATE: '/api/tasks/create',
    MOVE: '/api/tasks/move',
  },
  PRESENCE: {
    HEARTBEAT: '/api/presence/heartbeat',
  },
  WORKSPACES: {
    UPDATE: '/api/workspaces/update',
  },
  NOTIFICATIONS: {
    MANAGE: '/api/notifications/manage',
  },
  CHAT: {
    TYPING: '/api/chat/typing',
  },
} as const;

export const ROUTES = {
  ROOT: '/',
  AUTH: '/auth',
  CHAT: '/chat',
  TASKS: '/tasks',
  ACTIVITY: '/activity',
  WORKSPACES: '/workspaces',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super admin',
} as const;

export const ACTIVITY_TYPES = {
  MESSAGE_SENT: 'MESSAGE_SENT',
  TASK_CREATED: 'TASK_CREATED',
  TASK_MOVED: 'TASK_MOVED',
  TASK_COMMENTED: 'TASK_COMMENTED',
  THREAD_REPLY_SENT: 'THREAD_REPLY_SENT',
  WORKSPACE_CREATED: 'WORKSPACE_CREATED',
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.CHAT,
  ROUTES.TASKS,
  ROUTES.ACTIVITY,
  ROUTES.WORKSPACES,
  ROUTES.PROFILE,
];

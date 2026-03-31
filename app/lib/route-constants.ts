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

export const PROTECTED_ROUTES = [
  ROUTES.CHAT,
  ROUTES.TASKS,
  ROUTES.ACTIVITY,
  ROUTES.WORKSPACES,
  ROUTES.PROFILE,
];

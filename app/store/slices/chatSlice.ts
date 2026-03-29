import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
  reactions?: Record<string, string[]>;
  threadCount?: number;
  isPinned?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  membersCount: number;
}

export interface Workspace {
  id: string;
  name: string;
  avatar: string;
}

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  lastSeen?: { 
    seconds: number; 
    nanoseconds: number;
  } | null;
}

interface ChatState {
  workspaces: Workspace[];
  channels: Channel[];
  messages: Message[];
  users: AppUser[];
  unreadCounts: Record<string, number>;
  loading: {
    workspaces: boolean;
    channels: boolean;
    messages: boolean;
    users: boolean;
  };
}

const initialState: ChatState = {
  workspaces: [],
  channels: [],
  messages: [],
  users: [],
  unreadCounts: {},
  loading: {
    workspaces: true,
    channels: true,
    messages: true,
    users: true,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
      state.loading.workspaces = false;
    },
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload;
      state.loading.channels = false;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.loading.messages = false;
    },
    setMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.messages = action.payload;
    },
    setUsers: (state, action: PayloadAction<AppUser[]>) => {
      state.users = action.payload;
      state.loading.users = false;
    },
    setUnreadCounts: (state, action: PayloadAction<Record<string, number>>) => {
      state.unreadCounts = action.payload;
    },
  },
});

export const { 
  setWorkspaces, 
  setChannels, 
  setMessages, 
  setMessagesLoading,
  setUsers,
  setUnreadCounts
} = chatSlice.actions;

export default chatSlice.reducer;

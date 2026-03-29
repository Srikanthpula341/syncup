import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isThreadOpen: boolean;
  activeWorkspaceId: string | null;
  activeChannelId: string | null;
  activeThreadMessageId: string | null;
}

const initialState: UIState = {
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isThreadOpen: false,
  activeWorkspaceId: 'syncup-workspace',
  activeChannelId: 'general',
  activeThreadMessageId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    openThread: (state, action: PayloadAction<string>) => {
      state.isThreadOpen = true;
      state.activeThreadMessageId = action.payload;
    },
    closeThread: (state) => {
      state.isThreadOpen = false;
      state.activeThreadMessageId = null;
    },
    setActiveWorkspace: (state, action: PayloadAction<string>) => {
      state.activeWorkspaceId = action.payload;
    },
    setActiveChannel: (state, action: PayloadAction<string>) => {
      state.activeChannelId = action.payload;
      state.isMobileMenuOpen = false; // Auto-close on select
    },
  },
});

export const {
  toggleSidebar,
  toggleMobileMenu,
  setMobileMenuOpen,
  openThread,
  closeThread,
  setActiveWorkspace,
  setActiveChannel,
} = uiSlice.actions;

export default uiSlice.reducer;

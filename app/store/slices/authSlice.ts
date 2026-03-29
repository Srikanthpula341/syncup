import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = 'loading';
    },
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.error = null;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.status = 'unauthenticated';
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setAuthLoading, setAuthUser, setAuthError, signOut } = authSlice.actions;

export default authSlice.reducer;

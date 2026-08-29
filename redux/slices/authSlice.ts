import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/models/user/User';

interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateWalletBalance: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.wallet_balance = action.payload;
      }
    },
    clearAuth: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setAuthUser, setAuthLoading, updateWalletBalance, clearAuth } = authSlice.actions;
export default authSlice.reducer;

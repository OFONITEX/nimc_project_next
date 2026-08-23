import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  activeVerificationTab: 'nin' | 'phone' | 'demo';
}

const initialState: UiState = {
  isSidebarOpen: false,
  activeVerificationTab: 'nin',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setActiveVerificationTab: (state, action: PayloadAction<'nin' | 'phone' | 'demo'>) => {
      state.activeVerificationTab = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveVerificationTab } = uiSlice.actions;
export default uiSlice.reducer;

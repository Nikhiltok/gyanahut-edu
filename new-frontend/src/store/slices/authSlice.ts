import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STUDENT";
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

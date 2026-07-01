import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  USER_KEY,
} from "../constants/authStorageConstants";
import type { LoggedUser } from "../models/auth.model";

interface AuthState {
  user: LoggedUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const storedUser = localStorage.getItem(USER_KEY);
const storedToken = localStorage.getItem(TOKEN_KEY);

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as LoggedUser) : null,
  token: storedToken ?? null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: LoggedUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      localStorage.setItem(TOKEN_KEY, action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

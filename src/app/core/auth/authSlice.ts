import type User from "@/app/features/users/data/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Setting } from "../data/setting";
import { AuthConstants } from "./authConstants";

interface AuthState {
  isAuthenticated: boolean;
  loggedInUser: Partial<User> | undefined;
  setting: Partial<Setting> | undefined;
}

const getInitialState = (): AuthState => {
  const authStatus = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
  const savedUser = localStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
  const savedSetting = localStorage.getItem(AuthConstants.SettingStorageItemName);
  
  return {
    isAuthenticated: authStatus,
    loggedInUser: savedUser ? JSON.parse(savedUser) : undefined,
    setting: savedSetting ? JSON.parse(savedSetting) : undefined,
  };
};
export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login: (state, action: PayloadAction<{ user: User; setting: Setting } | undefined>) => {
      state.isAuthenticated = true;
      localStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");

      if (action.payload) {
        state.loggedInUser = action.payload.user;
        localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(action.payload.user));
        
        state.setting = action.payload.setting;
        localStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(action.payload.setting));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.loggedInUser = undefined;
      state.setting = undefined;
      
      localStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
      localStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
      localStorage.removeItem(AuthConstants.SettingStorageItemName);
    },
    updateLoggedInUser: (state, action: PayloadAction<User>) => {
      state.loggedInUser = action.payload;
      localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(action.payload));
    },
    updateSetting: (state, action: PayloadAction<Setting>) => {
      state.setting = action.payload;
      localStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(state.setting));
    },
    // This is for your storage event syncing (multi-tab support)
    syncFromStorage: (state) => {
      state.isAuthenticated = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
      
      const savedUser = localStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
      state.loggedInUser = savedUser ? JSON.parse(savedUser) : undefined;
      
      const savedSetting = localStorage.getItem(AuthConstants.SettingStorageItemName);
      state.setting = savedSetting ? JSON.parse(savedSetting) : undefined;
    }
  },
});

export const { login, logout, updateLoggedInUser, updateSetting, syncFromStorage } = authSlice.actions;
export default authSlice.reducer;
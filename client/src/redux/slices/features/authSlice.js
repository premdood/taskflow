import { createSlice } from "@reduxjs/toolkit";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../../../utils/user.js";

const initialState = {
  user: getUserFromLocalStorage().user,
  token: getUserFromLocalStorage().token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      saveUserToLocalStorage(token, user);
      state.user = user;
      state.token = token;
    },
    removeCredentials: (state) => {
      removeUserFromLocalStorage();
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;

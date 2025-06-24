import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUser: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      state.loading = false;
    },

    setToken: (state, action) => {
      const {accessToken} = action.payload;
      state.token = accessToken;
      localStorage.setItem("token", action.payload);
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setLoading, setUser, setToken, setError, logout } = authSlice.actions;
export default authSlice.reducer;

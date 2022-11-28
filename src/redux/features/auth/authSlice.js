import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  isAdmin: JSON.parse(localStorage.getItem('isAdmin')),
  isSuperAdmin: JSON.parse(localStorage.getItem('isSuperAdmin')),
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  college: localStorage.getItem('college'),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    loadUser(state) {
      state.isAdmin = JSON.parse(localStorage.getItem('isAdmin')) || false;
      state.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperAdmin')) || false;
      state.token = localStorage.getItem('token') || null;
      state.isLoggedIn = localStorage.getItem('token') ? true : false;
      state.userId = localStorage.getItem('userId') || null;
      state.college = localStorage.getItem('college') || null;
    },
    signIn(state, action) {
      const { payload } = action;
      const { token, id, isAdmin, collegeName, isSuperAdmin } = payload;

      state.token = token;
      state.college = collegeName;
      state.isAdmin = isAdmin;
      state.isSuperAdmin = isSuperAdmin;
      state.isLoggedIn = true;
      state.userId = id;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('isAdmin', isAdmin);
      localStorage.setItem('isSuperAdmin', isSuperAdmin);
      localStorage.setItem('college', collegeName);
    },
    signOut(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.isAdmin = false;
      state.isAdmin = false;
      state.userId = null;
      state.college = null;
      localStorage.clear();
    },
  },
});

export const { signIn, signOut, setLoading, loadUser } = authSlice.actions;

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toastList: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    clearAllToast: (state) => {
      state.toastList = [];
    },
    removeToast: (state, action) => {
      const index = action.payload;
      state.toastList.splice(index, 1);
    },
    addToast: (state, { payload }) => {
      state.toastList = [...state.toastList, payload];
    },
  },
});

export const { clearAllToast, removeToast, addToast } = toastSlice.actions;

export default toastSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const adminInfoFromStorage = localStorage.getItem('adminInfo')
  ? JSON.parse(localStorage.getItem('adminInfo'))
  : null;

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminInfo: adminInfoFromStorage,
  },
  reducers: {
    adminLoginSuccess: (state, action) => {
      state.adminInfo = action.payload;
    },
    adminLogout: (state) => {
      state.adminInfo = null;
    },
  },
});

export const { adminLoginSuccess, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;

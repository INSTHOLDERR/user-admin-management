import { createSlice } from '@reduxjs/toolkit';

const storedUserInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

  
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: storedUserInfo,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

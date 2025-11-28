import {configureStore} from '@reduxjs/toolkit';

import userReducer from '../Slice/userSlice';
import adminReducer from '../Slice/adminSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    admin:adminReducer

  },
});
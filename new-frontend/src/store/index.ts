import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import examFilterReducer from "./slices/examFilterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    examFilter: examFilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import examFilterReducer from "./slices/examFilterSlice";
import localeReducer from "./slices/localeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    examFilter: examFilterReducer,
    locale: localeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

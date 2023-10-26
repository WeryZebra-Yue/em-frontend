import Reducer from "./redux";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: Reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

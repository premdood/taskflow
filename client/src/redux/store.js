import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./slices/features/apiSlice.js";
import authReducer from "./slices/features/authSlice.js";
import uiReducer from "./slices/features/uiSlice.js";
import listenerMiddleware from "./middleware/listenerMiddleware.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaltMiddleware) =>
    getDefaltMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;

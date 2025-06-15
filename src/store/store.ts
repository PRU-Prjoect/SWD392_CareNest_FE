import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";      // <── localStorage
import authReducer from "./slices/authSlice";
import registeReducer from "./slices/registerSlice";

/* 1. Gộp reducer */
const rootReducer = combineReducers({
  auth: authReducer,
  register: registeReducer,
});

/* 2. Thiết lập persist */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],      // chỉ lưu slice auth
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* 3. Tạo store */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,        // bỏ qua check của redux-persist
        ],
      },
    }),
});

/* 4. Tạo persistor */
export const persistor = persistStore(store);

/* 5. Kiểu hỗ trợ */
export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

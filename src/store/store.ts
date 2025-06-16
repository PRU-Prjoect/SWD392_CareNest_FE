// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import registeReducer from "./slices/registerSlice";
import registerCustomerReducer from "./slices/registerCustomerSlice";
import registerShopReducer from "./slices/registerShopSlice"; // ✅ Import mới

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registeReducer,
    registerCustomer: registerCustomerReducer,
    registerShop: registerShopReducer, // ✅ Thêm reducer mới
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

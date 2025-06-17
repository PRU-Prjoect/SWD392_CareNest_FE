// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import registeReducer from "./slices/registerSlice";
import registerCustomerReducer from "./slices/registerCustomerSlice";
import registerShopReducer from "./slices/registerShopSlice"; 
import customerReducer from "./slices/customerSlice";
import shopReducer from "./slices/shopSlice";

export const store = configureStore({
 reducer: {
    auth: authReducer,
    register: registerReducer,
    registerCustomer: registerCustomerReducer,
    registerShop: registerShopReducer,
    customer: customerReducer,
    shop: shopReducer,
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

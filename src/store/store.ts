// store/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import registeReducer from "./slices/registerSlice";
import registerCustomerReducer from "./slices/registerCustomerSlice";
import registerShopReducer from "./slices/registerShopSlice";
import customerReducer from "./slices/customerSlice";
import shopReducer from "./slices/shopSlice";
import accountReducer from "./slices/AccountSlice";
import subAddressSliceReducer from "./slices/subAddressSlice";
import serviceTypeShopReducer from "./slices/serviceTypeShopSlice";
import serviceReducer from "./slices/serviceSlice";
import appointmentReducer from "./slices/appointmentSlice";
import serviceAppointmentReducer from "./slices/serviceAppointmentSlice";
import hotelReducer from "./slices/hotelSlice";
import roomReducer from "./slices/roomSlice";
import roomBookingReducer from "./slices/roomBookingSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  register: registeReducer,
  registerCustomer: registerCustomerReducer,
  registerShop: registerShopReducer,
  customer: customerReducer,
  shop: shopReducer,
  account: accountReducer,
  subAddress: subAddressSliceReducer,
  serviceTypeShop: serviceTypeShopReducer,
  service: serviceReducer,
  appointment: appointmentReducer,
  service_appointment: serviceAppointmentReducer,
  hotel: hotelReducer,
  room: roomReducer,
  roomBooking: roomBookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

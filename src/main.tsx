import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store, persistor } from "./store/store";
import { setLogoutCallback, updateStateToken } from "./config/axios";
import { logout } from "./store/slices/authSlice";
import App from "./App";
import "./index.css";

/* Giữ nguyên interceptor */
store.subscribe(() => {
  updateStateToken(store.getState().auth.token);
});
setLogoutCallback(() => store.dispatch(logout()));     // khi token 401

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            toastStyle={{ zIndex: 99999 }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

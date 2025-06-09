// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store/store";
import { setLogoutCallback, updateStateToken } from "./config/axios"; // ✅ Đường dẫn đúng
import { logout } from "./store/slices/authSlice";
import App from "./App";
import "./index.css";

// ✅ Thiết lập callback cho axios interceptor
store.subscribe(() => {
  const state = store.getState();
  updateStateToken(state.auth.token);
});

setLogoutCallback(() => {
  store.dispatch(logout());
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 99999 }}
          toastStyle={{ zIndex: 99999 }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

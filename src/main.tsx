import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App";
import { AppWrapper } from "./components/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AppWrapper>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
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
        // ✅ Thiết lập z-index cao
        style={{ zIndex: 99999 }}
        toastStyle={{ zIndex: 99999 }}
      />{" "}
    </AppWrapper>
  </ThemeProvider>
);

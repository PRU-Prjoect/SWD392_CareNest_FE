// src/App.tsx
import { PersistGate } from "redux-persist/integration/react";
import { AuthWrapper } from "./pages/Login/components/AuthWrapper";
import AppRoutes from "./routes/index";
import { persistor } from "./store/store";

function App() {
  return (
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <AuthWrapper>
        <AppRoutes />
      </AuthWrapper>
    </PersistGate>
  );
}

export default App;

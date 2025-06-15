// src/App.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AuthWrapper } from "./pages/Login/components/AuthWrapper";
import { restoreAuth } from "./store/slices/authSlice";
import type { AppDispatch } from "./store/store";
import AppRoutes from "./routes/index";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <AuthWrapper>
      <AppRoutes />
    </AuthWrapper>
  );
}

export default App;

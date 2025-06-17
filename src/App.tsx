// src/App.tsx
import { AuthWrapper } from "./pages/Login/components/AuthWrapper";
import AppRoutes from "./routes/index";

function App() {
  return (
    <AuthWrapper>
      <AppRoutes />
    </AuthWrapper>
  );
}

export default App;

// src/components/AuthWrapper.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "../../../store/slices/authSlice";
import type { AppDispatch } from "../../../store/store";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return <>{children}</>;
};

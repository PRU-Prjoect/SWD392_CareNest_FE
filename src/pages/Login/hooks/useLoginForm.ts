// src/pages/Login/hooks/useLoginForm.ts
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Login, LoginNoRemember } from "../../../store/slices/authSlice";
import type { RootState, AppDispatch } from "../../../store/store";

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export const useLoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field in formErrors && formErrors[field as keyof FormErrors]) {
      setFormErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.username) {
      errors.username = "Tên đăng nhập không được để trống";
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const loginAction = formData.rememberMe ? Login : LoginNoRemember;

      await dispatch(
        loginAction({
          username: formData.username,
          password: formData.password,
        })
      ).unwrap();

      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
    }
  };

  return {
    formData,
    formErrors,
    showPassword,
    loading,
    error,
    isAuthenticated,
    user,
    handleInputChange,
    handleSubmit,
    setShowPassword,
  };
};

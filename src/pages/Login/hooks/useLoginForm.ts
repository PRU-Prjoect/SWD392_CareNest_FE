// src/pages/Login/hooks/useLoginForm.ts
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { Login, LoginNoRemember } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // ✅ Sửa useEffect để redirect dựa trên role
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Đăng nhập thành công!");

      // ✅ Kiểm tra role để điều hướng
      setTimeout(() => {
        if (user.role === "Shop") {
          navigate("/shop/dashboard", { replace: true });
        } else {
          navigate("/app/home", { replace: true });
        }
      }, 1000);
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error khi user typing
    if (field === "username" || field === "password") {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors = { username: "", password: "" };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = "Tên đăng nhập không được để trống";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // ✅ Use the correct async thunk based on rememberMe
      const loginAction = formData.rememberMe ? Login : LoginNoRemember;

      const result = await dispatch(
        loginAction({
          username: formData.username,
          password: formData.password,
        })
      );

      if (loginAction.fulfilled.match(result)) {
        console.log("✅ Login successful:", result.payload);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
    }
  };

  return {
    formData,
    formErrors,
    showPassword,
    loading,
    error,
    isAuthenticated,
    handleInputChange,
    handleSubmit,
    setShowPassword,
  };
};

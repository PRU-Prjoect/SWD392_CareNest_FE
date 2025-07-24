// src/pages/Login/hooks/useLoginForm.ts
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { Login, LoginNoRemember, logout } from "@/store/slices/authSlice";
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

  // ✅ Thêm ref để track login attempts
  const hasRedirected = useRef(false);
  const loginAttempted = useRef(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Đảm bảo trạng thái xác thực được xóa sạch khi trang Login được mở
  useEffect(() => {
    // Kiểm tra nếu đang ở trang login mà vẫn còn dữ liệu xác thực (có thể do logout không hoàn toàn)
    // thì sẽ thực hiện logout lại để đảm bảo xóa sạch dữ liệu
    if (isAuthenticated || localStorage.getItem('authToken')) {
      console.log("⚠️ Phát hiện dữ liệu xác thực còn sót lại, thực hiện logout lại");
      dispatch(logout());
      
      // Đợi một chút để đảm bảo dữ liệu được xóa hoàn toàn
      setTimeout(() => {
        // Double-check và xóa thủ công nếu cần
        if (localStorage.getItem('authToken')) {
          localStorage.removeItem('authToken');
        }
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user');
        }
      }, 100);
    }
  }, [dispatch]);

  // ✅ Sửa useEffect với proper conditions
  useEffect(() => {
    // Chỉ redirect nếu:
    // 1. Đã authenticated
    // 2. Có user data
    // 3. Đã attempt login (không phải từ restoreAuth)
    // 4. Chưa redirect lần nào
    if (
      isAuthenticated &&
      user &&
      loginAttempted.current &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      toast.success("Đăng nhập thành công!");

      console.log("🔄 Redirecting user with role:", user.role);

      setTimeout(() => {
        // Kiểm tra nếu là Admin hoặc role 4 hoặc username là admin
        if (user.username === "admin" || user.role === "Admin" || user.role === "4" || Number(user.role) === 4) {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "Shop") {
          navigate("/shop/dashboard", { replace: true });
        } else {
          navigate("/app/home", { replace: true });
        }
      }, 1000);
    }
  }, [isAuthenticated, user, navigate]);

  // ✅ Reset redirect flag khi component unmount hoặc logout
  useEffect(() => {
    if (!isAuthenticated) {
      hasRedirected.current = false;
      loginAttempted.current = false;
    }
  }, [isAuthenticated]);

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
      // ✅ Mark that login was attempted manually
      loginAttempted.current = true;
      hasRedirected.current = false;

      const loginAction = formData.rememberMe ? Login : LoginNoRemember;

      const result = await dispatch(
        loginAction({
          username: formData.username,
          password: formData.password,
        })
      );

      if (loginAction.fulfilled.match(result)) {
        console.log("✅ Login successful:", result.payload);
      } else {
        // Reset flags nếu login failed
        loginAttempted.current = false;
        hasRedirected.current = false;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      loginAttempted.current = false;
      hasRedirected.current = false;
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

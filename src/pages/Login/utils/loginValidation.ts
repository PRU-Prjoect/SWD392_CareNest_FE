// utils/loginValidation.ts
interface LoginFormData {
  username: string; // ✅ Đổi từ email sang username
  password: string;
}

interface LoginFormErrors {
  username?: string; // ✅ Đổi từ email sang username
  password?: string;
}

export const validateLogin = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // ✅ Validate username thay vì email
  if (!data.username) {
    errors.username = "Tên đăng nhập không được để trống";
  } else if (data.username.length < 3) {
    errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  }

  // Validate password
  if (!data.password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (data.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return errors;
};

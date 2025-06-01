interface LoginFormData {
    email: string;
    password: string;
  }
  
  interface LoginFormErrors {
    email?: string;
    password?: string;
  }
  
  export const validateLogin = (data: LoginFormData): LoginFormErrors => {
    const errors: LoginFormErrors = {};
  
    // Validate email
    if (!data.email) {
      errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email không hợp lệ';
    }
  
    // Validate password
    if (!data.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (data.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
  
    return errors;
  };
  
// src/utils/errorHandling.ts
import { toast } from "react-toastify";
import { getUserFriendlyErrorMessage } from "../config/axios";

/**
 * Hiển thị thông báo lỗi thân thiện với người dùng
 * @param error - Đối tượng lỗi từ API hoặc exception
 * @param defaultMessage - Thông báo mặc định nếu không có lỗi cụ thể
 */
export const handleErrorWithToast = (
  error: unknown, 
  defaultMessage: string = "Đã xảy ra lỗi, vui lòng thử lại"
): void => {
  toast.error(getUserFriendlyErrorMessage(error) || defaultMessage);
};

/**
 * Xử lý lỗi API theo ngữ cảnh cụ thể
 * @param error - Đối tượng lỗi từ API hoặc exception
 * @param context - Ngữ cảnh của lỗi (để hiển thị thông báo phù hợp)
 */
export const handleContextualError = (
  error: unknown,
  context: "create" | "update" | "delete" | "fetch" | "auth" | "upload"
): void => {
  const err = error as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        message?: string;
        [key: string]: unknown;
      };
    };
  };

  // Kiểm tra các trường hợp lỗi đặc biệt
  if (err?.message?.includes("entity changes") || err?.message?.includes("saving")) {
    if (context === "create") {
      toast.error("Không thể tạo mới do trùng lặp dữ liệu. Vui lòng kiểm tra lại thông tin.");
    } else {
      toast.error("Không thể cập nhật do trùng lặp dữ liệu. Vui lòng kiểm tra lại thông tin.");
    }
    return;
  }

  // Xử lý theo ngữ cảnh
  switch (context) {
    case "create":
      toast.error(getUserFriendlyErrorMessage(error) || "Không thể tạo mới. Vui lòng thử lại.");
      break;
    
    case "update":
      toast.error(getUserFriendlyErrorMessage(error) || "Không thể cập nhật. Vui lòng thử lại.");
      break;
    
    case "delete":
      toast.error(getUserFriendlyErrorMessage(error) || "Không thể xóa. Vui lòng thử lại.");
      break;
    
    case "fetch":
      toast.error(getUserFriendlyErrorMessage(error) || "Không thể tải dữ liệu. Vui lòng thử lại.");
      break;

    case "auth":
      toast.error(getUserFriendlyErrorMessage(error) || "Lỗi xác thực. Vui lòng thử lại.");
      break;

    case "upload":
      toast.error(getUserFriendlyErrorMessage(error) || "Không thể tải file lên. Vui lòng thử lại.");
      break;

    default:
      toast.error(getUserFriendlyErrorMessage(error));
  }
};

/**
 * Xử lý lỗi API cho các trường hợp cụ thể về khách sạn
 */
export const handleHotelError = (error: unknown): void => {
  const err = error as { message?: string };
  
  if (err?.message?.includes("entity changes") || err?.message?.includes("saving")) {
    toast.error("Không thể tạo khách sạn có cùng địa chỉ với một khách sạn đã tồn tại!");
    return;
  }

  toast.error(getUserFriendlyErrorMessage(error) || "Thao tác với khách sạn thất bại. Vui lòng thử lại.");
};

/**
 * Xử lý lỗi API cho các trường hợp cụ thể về chi nhánh
 */
export const handleBranchError = (error: unknown): void => {
  const err = error as { message?: string };
  
  if (err?.message?.includes("entity changes") || err?.message?.includes("saving")) {
    toast.error("Không thể tạo chi nhánh có cùng địa chỉ với một chi nhánh đã tồn tại!");
    return;
  }

  toast.error(getUserFriendlyErrorMessage(error) || "Thao tác với chi nhánh thất bại. Vui lòng thử lại.");
}; 
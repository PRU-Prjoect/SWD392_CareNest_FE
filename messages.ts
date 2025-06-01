export const MESSAGES = {
  INTERNAL_ERROR: "common.internal_error",
  SERVER_ERROR: "common.server_error",
  SUCCESS: "common.success",
  FAILED: "common.failed",
  DIFFERENT_USER: "common.different_user",
  NOT_FOUND: "common.not_found",
  ALREADY_REMOVED: "common.already_removed",
  VALIDATION: {
    REQUIRED_FIELD: (field: string) => `validation.required:${field}`,
    NOT_EMPTY_FIELD: (field: string) => `validation.not_empty:${field}`,
    NOT_EMPTY_ARRAY_FIELD: (field: string) =>
      `validation.not_empty_array:${field}`,
    INVALID_FIELD: (field: string) => `validation.invalid:${field}`,
    FIELD_TOO_LONG: (field: string) => `validation.too_long:${field}`,
    FIELD_TOO_SHORT: (field: string) => `validation.too_short:${field}`,
    FIELD_EXISTS: (field: string) => `validation.exists:${field}`,
    NOT_FOUND_FIELD: (field: string) => `validation.not_found:${field}`,
    DUPLICATE_VALUE: (field: string) => `validation.duplicate_value:${field}`,
    INVALID_SKIP_CURSOR: "validation.invalid_skip_cursor",
    // Thêm các lỗi trùng lặp mới
    EXISTS_NAME_EMAIL_PHONE_COMPANYNAME:
      "validation.exists:name-email-phone-companyName",
    EXISTS_NAME_EMAIL_PHONE: "validation.exists:name-email-phone",
    EXISTS_NAME_EMAIL_COMPANYNAME: "validation.exists:name-email-companyName",
    EXISTS_NAME_PHONE_COMPANYNAME: "validation.exists:name-phone-companyName",
    EXISTS_EMAIL_PHONE_COMPANYNAME: "validation.exists:email-phone-companyName",
    EXISTS_NAME_EMAIL: "validation.exists:name-email",
    EXISTS_NAME_PHONE: "validation.exists:name-phone",
    EXISTS_NAME_COMPANYNAME: "validation.exists:name-companyName",
    EXISTS_EMAIL_PHONE: "validation.exists:email-phone",
    EXISTS_EMAIL_COMPANYNAME: "validation.exists:email-companyName",
    EXISTS_PHONE_COMPANYNAME: "validation.exists:phone-companyName",
    EXISTS_NAME: "validation.exists:name",
    EXISTS_EMAIL: "validation.exists:email",
    EXISTS_PHONE: "validation.exists:phone",
    EXISTS_COMPANYNAME: "validation.exists:companyName",
    REQUIRED: "validation.required_field",
    EMAIL_EXISTS: "validation.email_exists",
  },
  COMMON: {
    GET_LIST: {
      INVALID_TAKE: "common.get_list.invalid_take",
      INVALID_SKIP: "common.get_list.invalid_skip",
      MAX_TAKE_EXCEEDED: "common.get_list.max_take_exceeded",
    },
    REMOVE: {
      INVALID_REMOVE_PAYLOAD: "common.remove.invalid_remove_payload",
    },
  },
  USER: {
    LOGIN: {
      INACTIVE: "user.login.inactive",
    },
  },
  UPLOAD: {
    INVALID_IMAGE_TYPE: "upload.invalid_image_type",
    EXIF_EXTRACTION_FAILED: "upload.exif_extraction_failed",
    MISSING_IMAGE_FILE: "upload.missing_image_file",
    UPLOAD_ERROR: "upload.upload_error",
    FILE_SIZE_EXCEEDED: "upload.file_size_exceeded",
    SUCCESS_BUT_NO_EXIF_DATA: "upload.success_but_no_exif_data",
  },
  INCIDENT: {
    ALREADY_HANDLED: "incident.already_handled",
    ALREADY_RESOLVED: "incident.already_resolved",
    HANDLED_BY_OTHER_USER: "incident.handled_by_other_user",
    TASK_ITEM_HAS_TASK_SUB_ITEMS:
      "incident.task_item_has_task_sub_items_cannot_have_description_weight_unit_price_total",
    TASK_ITEM_MISSING_TASK_SUB_ITEMS:
      "incident.task_item_missing_task_sub_items_must_have_description_weight_unit_price_total",
  },
  NETWORK: {
    ERROR: "network.error",
  },
};

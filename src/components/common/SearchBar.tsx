// * SearchBar: Thanh tìm kiếm động, hỗ trợ nhiều loại trường (text, select, date)
// ! Quản lý dropdown select riêng cho từng trường, tránh bị đóng mở đồng loạt
// ? Nếu muốn thêm type mới (checkbox, radio...), cần bổ sung ở đây

import React, { useState, useRef, useEffect } from "react";

export interface SearchField {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "select" | "date";
  options?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  width?: string;
}

interface SearchBarProps {
  fields: SearchField[];
  onSearch: (values: Record<string, string>) => void;
  buttonLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  fields,
  onSearch,
  buttonLabel = "Tìm kiếm",
}) => {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(values);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const selectOption = (name: string, value: string) => {
    handleChange(name, value);
    setOpenDropdown(null);
  };

  const getSelectedLabel = (field: SearchField) => {
    if (!values[field.name]) return field.placeholder;
    const selectedOption = field.options?.find(
      (opt) => opt.value === values[field.name]
    );
    return selectedOption ? selectedOption.label : field.placeholder;
  };

  const setDropdownRef = (name: string, element: HTMLDivElement | null) => {
    dropdownRefs.current[name] = element;
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-wrap -mx-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={`px-2 mb-4 ${field.width || "w-1/3"}`}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-white mb-1"
            >
              {field.label}
            </label>
            {field.type === "select" ? (
              <div
                className="relative"
                ref={(el) => setDropdownRef(field.name, el)}
              >
                <div
                  className="w-full px-4 py-2 border border-white bg-white text-gray-900 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleDropdown(field.name)}
                >
                  <span
                    className={
                      values[field.name] ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {getSelectedLabel(field)}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {openDropdown === field.name && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div
                      className="px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-100"
                      onClick={() => selectOption(field.name, "")}
                    >
                      {field.placeholder}
                    </div>
                    {field.options?.map((option) => (
                      <div
                        key={option.value}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center text-gray-900"
                        onClick={() => selectOption(field.name, option.value)}
                      >
                        {option.icon && (
                          <span className="mr-2">{option.icon}</span>
                        )}
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : field.type === "date" ? (
              <input
                id={field.name}
                type="date"
                name={field.name}
                className="w-full px-4 py-2 bg-white text-gray-900 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <input
                id={field.name}
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 bg-white text-gray-900 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder:text-gray-500"
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="px-2 mb-4 flex items-end">
          <button
            type="submit"
            className="px-6 py-2 bg-white text-[#2A9D8F] font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] font-medium"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;

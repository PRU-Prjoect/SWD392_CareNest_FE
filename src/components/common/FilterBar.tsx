// components/common/FilterBar.tsx
import React, { useState, useRef, useEffect } from "react";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterConfig {
  name: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
}

interface FilterBarProps {
  onFilter: (filters: Record<string, string>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilter }) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Cấu hình các filter
  const filterConfigs: FilterConfig[] = [
    {
      name: "location",
      label: "Địa điểm",
      placeholder: "Chọn địa điểm",
      options: [
        { value: "", label: "Tất cả địa điểm" },
        { value: "hanoi", label: "Hà Nội" },
        { value: "hcm", label: "TP. Hồ Chí Minh" },
        { value: "danang", label: "Đà Nẵng" },
        { value: "haiphong", label: "Hải Phòng" },
      ],
    },
    {
      name: "petType",
      label: "Loại thú",
      placeholder: "Chọn loại thú",
      options: [
        { value: "", label: "Tất cả loại thú" },
        { value: "dog", label: "🐕 Chó" },
        { value: "cat", label: "🐱 Mèo" },
        { value: "bird", label: "🐦 Chim" },
        { value: "fish", label: "🐠 Cá" },
        { value: "rabbit", label: "🐰 Thỏ" },
      ],
    },
    {
      name: "sortBy",
      label: "Sắp xếp",
      placeholder: "Sắp xếp theo",
      options: [
        { value: "newest", label: "Mới nhất" },
        { value: "price_asc", label: "Giá tăng dần" },
        { value: "price_desc", label: "Giá giảm dần" },
        { value: "rating", label: "Đánh giá cao nhất" },
        { value: "distance", label: "Khoảng cách gần nhất" },
      ],
    },
    {
      name: "priceRange",
      label: "Khoảng giá",
      placeholder: "Chọn khoảng giá",
      options: [
        { value: "", label: "Tất cả giá" },
        { value: "0-100", label: "Dưới 100k" },
        { value: "100-300", label: "100k - 300k" },
        { value: "300-500", label: "300k - 500k" },
        { value: "500-1000", label: "500k - 1tr" },
        { value: "1000+", label: "Trên 1tr" },
      ],
    },
  ];

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

  const toggleDropdown = (filterName: string) => {
    setOpenDropdown((prev) => (prev === filterName ? null : filterName));
  };

  const selectOption = (filterName: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [filterName]: value,
    };
    setActiveFilters(newFilters);
    setOpenDropdown(null);
    onFilter(newFilters);
  };

  const getSelectedLabel = (config: FilterConfig) => {
    if (!activeFilters[config.name]) return config.placeholder;
    const selectedOption = config.options.find(
      (opt) => opt.value === activeFilters[config.name]
    );
    return selectedOption ? selectedOption.label : config.placeholder;
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilter({});
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) => value !== ""
  );

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center gap-3">
        {filterConfigs.map((config) => (
          <div
            key={config.name}
            className="relative"
            ref={(el) => {
              dropdownRefs.current[config.name] = el;
            }}
          >
            <button
              onClick={() => toggleDropdown(config.name)}
              className={`
                flex items-center gap-2 px-4 py-2 bg-white rounded-lg border
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/50
                transition-all duration-200 min-w-[160px] justify-between
                ${
                  activeFilters[config.name]
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-200"
                }
              `}
            >
              <span
                className={`text-sm ${
                  activeFilters[config.name]
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                {getSelectedLabel(config)}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  openDropdown === config.name ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {openDropdown === config.name && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {config.options.map((option) => (
                  <button
                    key={option.value}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => selectOption(config.name, option.value)}
                  >
                    {option.icon && <span>{option.icon}</span>}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;

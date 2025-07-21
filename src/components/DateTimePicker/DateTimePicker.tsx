// components/DateTimePicker/index.tsx
import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "./DateTimePicker.css";

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Chọn ngày và giờ",
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeValue, setTimeValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize from props
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (isValid(date)) {
          setSelectedDate(date);
          setTimeValue(format(date, "HH:mm"));
          setInputValue(format(date, "dd/MM/yyyy HH:mm", { locale: vi }));
        }
      } catch (error) {
        console.error("Invalid date value:", value);
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);

    // If time is already set, combine date and time
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":");
      const combinedDate = new Date(date);
      combinedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      setInputValue(format(combinedDate, "dd/MM/yyyy HH:mm", { locale: vi }));
      onChange(combinedDate.toISOString());
    } else {
      setInputValue(format(date, "dd/MM/yyyy", { locale: vi }));
    }
  };

  // Handle time change
  const handleTimeChange = (time: string) => {
    setTimeValue(time);

    if (selectedDate && time) {
      const [hours, minutes] = time.split(":");
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      setInputValue(format(combinedDate, "dd/MM/yyyy HH:mm", { locale: vi }));
      onChange(combinedDate.toISOString());
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  // Handle clear
  const handleClear = () => {
    setSelectedDate(undefined);
    setTimeValue("");
    setInputValue("");
    onChange("");
  };

  // Generate time options
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Check if date is disabled
  const isDayDisabled = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (date < now) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    return false;
  };

  return (
    <div
      ref={containerRef}
      className={`datetime-picker-container ${className}`}
    >
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={() => {}} // Read-only
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
            error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />

        {/* Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            {/* Date Picker */}
            <div className="p-4 border-r border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Chọn ngày
              </h4>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDayDisabled}
                locale={vi}
                className="rdp-custom"
                classNames={{
                  day_selected: "rdp-day-selected",
                  day_today: "rdp-day-today",
                  day_disabled: "rdp-day-disabled",
                }}
              />
            </div>

            {/* Time Picker */}
            <div className="p-4 w-48">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Chọn giờ
              </h4>
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 gap-1">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeChange(time)}
                      className={`px-3 py-2 text-sm text-left rounded hover:bg-gray-100 transition-colors ${
                        timeValue === time
                          ? "bg-teal-100 text-teal-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;

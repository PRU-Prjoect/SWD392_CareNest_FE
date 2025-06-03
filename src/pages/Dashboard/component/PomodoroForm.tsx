import React, { useState } from "react";

type PomodoroProps = {
  onCreate: (config: PomodoroConfig) => void;
};

export type PomodoroConfig = {
  title: string;
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
};

const PomodoroForm: React.FC<PomodoroProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState<PomodoroConfig>({
    title: "",
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "title" ? value : Number(value),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
        Tạo Pomodoro Time
      </h2>

      <div className="space-y-4">
        <InputField
          label="Tiêu đề công việc"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
        />
        <InputField
          label="Thời gian làm việc (phút)"
          name="workDuration"
          type="number"
          value={formData.workDuration}
          onChange={handleChange}
        />
        <InputField
          label="Thời gian nghỉ ngắn (phút)"
          name="shortBreak"
          type="number"
          value={formData.shortBreak}
          onChange={handleChange}
        />
        <InputField
          label="Thời gian nghỉ dài (phút)"
          name="longBreak"
          type="number"
          value={formData.longBreak}
          onChange={handleChange}
        />
        <InputField
          label="Chu kỳ nghỉ dài (ví dụ: 4)"
          name="longBreakInterval"
          type="number"
          value={formData.longBreakInterval}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={() => onCreate(formData)}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300 shadow-md"
      >
        Bắt đầu Pomodoro
      </button>
    </div>
  );
};

// Tách input thành 1 component để dễ tái sử dụng 
const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
    />
  </div>
);

export default PomodoroForm;

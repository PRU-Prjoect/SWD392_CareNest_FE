import React from "react";
import ComponentCard from "@/components/ui/Card";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DefaultInputs: React.FC = () => {
  const handleDateChange = (dates: Date[], currentDateString: string) => {
    console.log(dates, currentDateString);
  };

  return (
    <ComponentCard
      title="Default Inputs"
      desc="Input components with various styles"
    >
      <div className="space-y-4">
        {/* Date Picker Example */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Picker
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Select date"
            ref={(input) => {
              if (input) {
                flatpickr(input, {
                  onChange: handleDateChange,
                  dateFormat: "Y-m-d",
                });
              }
            }}
          />
        </div>
      </div>
    </ComponentCard>
  );
};

export default DefaultInputs;

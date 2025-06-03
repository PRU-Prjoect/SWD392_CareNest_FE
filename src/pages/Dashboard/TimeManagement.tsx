import React, { useState } from "react";
import PomodoroForm, { type PomodoroConfig } from "./component/PomodoroForm";
import PomodoroTimer from "./component/PomodoroTimer";
import AppLayout from "@/layout/AppLayout";

const TimeManagement: React.FC = () => {
  const [config, setConfig] = useState<PomodoroConfig | null>(null);

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {!config ? (
          <PomodoroForm onCreate={setConfig} />
        ) : (
          <PomodoroTimer config={config} />
        )}
      </div>
    </AppLayout>
  );
};

export default TimeManagement;

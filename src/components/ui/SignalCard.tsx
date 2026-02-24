import React from "react";

interface SignalCardProps {
  color: "red" | "yellow" | "green";
  level: string;
  reason: string;
}

const SignalCard: React.FC<SignalCardProps> = ({ color, level, reason }) => {
  const colorMap = {
    red: "bg-[#ef4444]",
    yellow: "bg-[#f59e0b]",
    green: "bg-[#22c55e]",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center gap-6">
      <div className={`w-20 h-20 rounded-full ${colorMap[color]} shadow-lg flex-shrink-0 flex items-center justify-center`}>
        <div className="w-16 h-16 rounded-full border-4 border-white/20"></div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{level}</h3>
        <p className="text-gray-600 leading-relaxed">{reason}</p>
      </div>
    </div>
  );
};

export default SignalCard;

import React from "react";
import { SWOTResult } from "@/types/trade";

interface SwotGridProps {
  swot: SWOTResult;
}

const SwotGrid: React.FC<SwotGridProps> = ({ swot }) => {
  const items = [
    {
      key: "S",
      title: "Strengths (강점)",
      content: swot.S,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: "💪",
    },
    {
      key: "W",
      title: "Weaknesses (약점)",
      content: swot.W,
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      icon: "⚠️",
    },
    {
      key: "O",
      title: "Opportunities (기회)",
      content: swot.O,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      icon: "📈",
    },
    {
      key: "T",
      title: "Threats (위협)",
      content: swot.T,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      icon: "🛑",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {items.map((item) => (
        <div key={item.key} className={`${item.bgColor} p-5 rounded-xl border border-white/50 shadow-sm transition-transform hover:scale-[1.01]`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{item.icon}</span>
            <h4 className={`font-bold ${item.textColor}`}>{item.title}</h4>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm">{item.content}</p>
        </div>
      ))}
    </div>
  );
};

export default SwotGrid;

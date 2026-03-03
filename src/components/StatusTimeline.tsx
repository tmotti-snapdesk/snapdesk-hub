"use client";

import { Check, Clock } from "lucide-react";

interface TimelineStep {
  key: string;
  label: string;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  currentStep: string;
}

export function StatusTimeline({ steps, currentStep }: StatusTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="relative">
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200" />
      <div
        className="absolute top-5 left-5 h-0.5 transition-all duration-500"
        style={{
          backgroundColor: "#A9BCB7",
          width:
            currentIndex === 0
              ? "0%"
              : `${(currentIndex / (steps.length - 1)) * 100}%`,
        }}
      />

      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                  isDone
                    ? "text-white"
                    : isCurrent
                    ? "bg-white text-[#A9BCB7]"
                    : "bg-white border-slate-200 text-slate-300"
                }`}
                style={
                  isDone
                    ? { backgroundColor: "#A9BCB7", borderColor: "#A9BCB7" }
                    : isCurrent
                    ? { borderColor: "#A9BCB7" }
                    : {}
                }
              >
                {isDone ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Clock className={`w-4 h-4 ${isPending ? "text-slate-300" : ""}`} />
                )}
              </div>
              <span
                className={`text-xs text-center max-w-[80px] font-medium leading-tight ${
                  isDone || isCurrent ? "text-[#1C1F25]" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

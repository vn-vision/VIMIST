import React from "react";

type ViewMode = "single" | "double" | "grid";

interface ViewModeButtonsProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

function ViewModeButtons({ viewMode, onViewChange }: ViewModeButtonsProps) {
  return (
    <div className="vn-flex vn-gap-2">
      <button
        onClick={() => onViewChange("single")}
        aria-label="Single column view"
        className={`vn-px-3 vn-py-2 vn-rounded-lg vn-text-sm vn-border ${
          viewMode === "single" ? "vn-bg-primary vn-text-white" : "vn-bg-white vn-border-gray-300"
        }`}
      >
        []
      </button>
      <button
        onClick={() => onViewChange("double")}
        aria-label="Double column view"
        className={`vn-px-3 vn-py-2 vn-rounded-lg vn-text-sm vn-border ${
          viewMode === "double" ? "vn-bg-primary vn-text-white" : "vn-bg-white vn-border-gray-300"
        }`}
      >
        [|]
      </button>
      <button
        onClick={() => onViewChange("grid")}
        aria-label="Grid view"
        className={`vn-px-3 vn-py-2 vn-rounded-lg vn-text-sm vn-border ${
          viewMode === "grid" ? "vn-bg-primary vn-text-white" : "vn-bg-white vn-border-gray-300"
        }`}
      >
        [-|-]
      </button>
    </div>
  );
}

export default ViewModeButtons;
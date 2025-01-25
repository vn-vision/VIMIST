import React, { useState } from "react";
import logo from "../assets/images/logo.jpg";

function CatalogueView() {
  // State to track the current view mode
  const [viewMode, setViewMode] = useState("single"); // "single", "double", "grid"

  // Function to handle view mode change
  const handleViewChange = (mode: string) => {
    setViewMode(mode);
  };

  // Dynamic classNames based on view mode
  const getGridClasses = () => {
    switch (viewMode) {
      case "single":
        return "vn-grid-cols-1";
      case "double":
        return "vn-grid-cols-2";
      case "grid":
        return "vn-grid-cols-3 sm:vn-grid-cols-4";
      default:
        return "vn-grid-cols-1";
    }
  };

  return (
    <div className="vn-min-h-screen vn-bg-gray-100 vn-p-4">
      {/* Header Section */}
      <div className="vn-flex vn-justify-between vn-items-center vn-mb-4">
        <h1 className="vn-text-2xl vn-font-bold">Catalogue</h1>
        {/* View Mode Buttons */}
        <div className="vn-flex vn-gap-2">
          <button
            onClick={() => handleViewChange("single")}
            className={`vn-px-3 vn-py-2 vn-rounded-lg vn-text-sm vn-border ${
              viewMode === "single" ? "vn-bg-blue-500 vn-text-white" : "vn-bg-white vn-border-gray-300"
            }`}
          >
            []
          </button>
          <button
            onClick={() => handleViewChange("double")}
            className={`vn-px-3 vn-py-2 vn-rounded-lg vn-text-sm vn-border ${
              viewMode === "double" ? "vn-bg-blue-500 vn-text-white" : "vn-bg-white vn-border-gray-300"
            }`}
          >
            [|]
          </button>
          <button
            onClick={() => handleViewChange("grid")}
            className={`vn-px-3 vn-py-2 vn-rounded-lg vn-text-sm vn-border ${
              viewMode === "grid" ? "vn-bg-blue-500 vn-text-white" : "vn-bg-white vn-border-gray-300"
            }`}
          >
            [-|-]
          </button>
        </div>
      </div>

      {/* Catalogue Items Section */}
      <div
        className={`vn-grid vn-gap-4 vn-overflow-y-auto vn-h-[80vh] ${getGridClasses()}`}
      >
        {/* Catalogue Item */}
        <div className="vn-bg-white vn-p-4 vn-rounded-lg vn-shadow-md">
          <img
            src={logo}
            alt="item"
            className="vn-w-full vn-h-48 vn-object-cover vn-rounded-lg"
          />
          <h2 className="vn-text-lg vn-font-bold vn-mt-2">Item Name</h2>
          <p className="vn-text-sm vn-text-gray-500">Item Description</p>
          <p className="vn-text-lg vn-font-bold vn-mt-2">$100</p>
          <button className="vn-bg-blue-500 vn-text-white vn-px-4 vn-py-2 vn-rounded-lg vn-mt-2">
            Add to Cart
          </button>
        </ div>
        
      </div>
    </div>
  );
}

export default CatalogueView;

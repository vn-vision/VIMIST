import React, { useMemo } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  placeholder?: string; // Optional placeholder prop
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  placeholder = "Select a category...",
}) => {
  // Memoize category options to avoid unnecessary re-renders
  const categoryOptions = useMemo(
    () => [
      { label: "All Categories", value: "all" },
      ...categories.map((category) => ({ label: category, value: category })),
    ],
    [categories]
  );

  return (
    <div className="vn-flex vn-items-center vn-gap-2 vn-py-2">
      <select
        onChange={(e) => onCategoryChange(e.target.value === "all" ? null : e.target.value)}
        value={selectedCategory || "all"}
        className="vn-px-4 vn-py-2 vn-rounded vn-bg-white vn-text-gray-700 vn-border vn-border-gray-300 
                   vn-focus:ring-2 vn-focus:ring-blue-500 vn-outline-none vn-cursor-pointer vn-transition"
      >
        {categoryOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;

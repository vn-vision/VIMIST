import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="vn-flex vn-gap-2 vn-overflow-x-auto vn-py-2">
      {/* Button to clear the selected category */}
      <button
        onClick={() => onCategoryChange(null)} // Reset to "All Categories"
        className={`vn-px-4 vn-py-2 vn-rounded ${
          !selectedCategory
            ? "vn-bg-blue-500 vn-text-white"
            : "vn-bg-gray-200 vn-text-gray-700"
        }`}
      >
        All Categories
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`vn-px-4 vn-py-2 vn-rounded ${
            selectedCategory === category
              ? "vn-bg-blue-500 vn-text-white"
              : "vn-bg-gray-200 vn-text-gray-700"
          }`}
          aria-label={`Filter by ${category}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

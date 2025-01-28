import React, { useMemo } from "react";
import GenericCard from "./GenericCard";
import { Product } from "../utils/api/inventoryAPI";

interface ProductGridProps {
  products: Product[];
  viewMode: "single" | "double" | "grid";
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
}

function ProductGrid({ products, viewMode, onAddToCart, onRemoveFromCart }: ProductGridProps) {
  // Memoize grid classes based on view mode
  const gridClasses = useMemo(() => {
    switch (viewMode) {
      case "single":
        return "vn-grid-cols-1 sm:vn-grid-cols-1 md:vn-grid-cols-1 lg:vn-grid-cols-1";
      case "double":
        return "vn-grid-cols-1 sm:vn-grid-cols-2 md:vn-grid-cols-2 lg:vn-grid-cols-2";
      case "grid":
        return "vn-grid-cols-1 sm:vn-grid-cols-2 md:vn-grid-cols-3 lg:vn-grid-cols-4";
      default:
        return "vn-grid-cols-1 sm:vn-grid-cols-2 md:vn-grid-cols-3 lg:vn-grid-cols-4";
    }
  }, [viewMode]);

  return (
    <div className={`vn-grid vn-gap-4 vn-overflow-hidden vn-overflow-y-auto vn-h-[calc(100vh-4rem)] ${gridClasses} vn-justify-items-center vn-p-4`}>
      {products.map((product) => (
        <GenericCard
          key={product.id}
          image={
            product.image instanceof File
              ? URL.createObjectURL(product.image)
              : product.image || ""
          }
          id={product.id}
          name={product.name}
          category={product.category}
          unit_price={product.unit_price}
          addToCart={() => onAddToCart(product)}
          removeFromCart={() => onRemoveFromCart(product)}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
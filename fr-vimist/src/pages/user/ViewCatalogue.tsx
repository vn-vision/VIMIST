import React, { useState, useEffect, useMemo } from "react";
import { useDisplayProducts } from "../../features/products/inventoryHook";
import { Product } from "../../utils/api/inventoryAPI";
import ProductGrid from "../../components/CatalogueView";
import ViewModeButtons from "../../components/ViewModeButtons";
import TopNavbar from "../../components/TopNavbar";
import CartSummary from "../../components/Cart";
import CategoryFilter from "../../components/CategoryFilter"; // assuming this is correctly imported
import useDebounce from "../../features/hooks/useDebounce";

type ViewMode = "single" | "double" | "grid";

function ViewCatalogue() {
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [showCartSummary, setShowCartSummary] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  const AllProducts = useDisplayProducts();

  // Using debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Filter products by search query and category
  useEffect(() => {
    if (AllProducts.data) {
      let filteredItems = AllProducts.data;

      // Filter by category if selected
      if (selectedCategory) {
        filteredItems = filteredItems.filter(
          (item) => item.category === selectedCategory
        );
      }

      // Filter by search query
      if (debouncedSearchQuery) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.name
              ?.toLowerCase()
              .includes(debouncedSearchQuery.toString().toLowerCase()) ||
            item.id?.toString().includes(debouncedSearchQuery.toString()) ||
            item.category?.toLowerCase().includes(debouncedSearchQuery.toString().toLowerCase())
        );
      }

      setFilteredData(filteredItems);
    }
  }, [debouncedSearchQuery, selectedCategory, AllProducts.data]);

  // Memoize filteredData for performance
  const memoizedFilteredData = useMemo(() => filteredData, [filteredData]);

  // Handle adding a product to the cart
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Handle removing a product from the cart
  const handleRemoveFromCart = (product: Product) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== product.id)
    );
  };

  // Handle search input
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
  };

  // Handle category change, clearing the search query
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery(""); // clear search when category changes
  };

  // Handle loading and error states
  if (AllProducts.status === "loading") {
    return <div>Loading...</div>;
  }

  if (AllProducts.error) {
    return <div>Error loading products: {AllProducts.error}</div>;
  }

  return (
    <div className="vn-min-h-screen vn-bg-white vn-p-4">
      {/* Header Section */}
      <div className="vn-flex vn-flex-col vn-gap-4 vn-mb-4">
        <h1 className="vn-text-2xl vn-font-bold">Catalogue</h1>
        {/* Top Navbar */}
        <TopNavbar onSearch={handleSearch} />
        <ViewModeButtons viewMode={viewMode} onViewChange={setViewMode} />
        <CategoryFilter
          categories={AllProducts.data?.map((product) => product.category) ?? []}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Toggle Button for Small Screens */}
      {cart.length > 0 && (
        <div className="lg:vn-hidden vn-w-full vn-text-center vn-mb-4">
          <button
            onClick={() => setShowCartSummary(!showCartSummary)}
            className="vn-bg-primary vn-text-white vn-py-2 vn-px-4 vn-rounded"
          >
            {showCartSummary ? "Back to Catalogue" : "View Cart"}
          </button>
        </div>
      )}

      {/* Main Content Section */}
      <div className="vn-flex vn-gap-4 vn-bg-slate-200">
        {/* Catalogue Section */}
        <div
          className={`vn-flex-1 vn-bg-white vn-my-2 ${
            showCartSummary ? "md:vn-block vn-hidden" : "vn-block"
          }`}
        >
          <ProductGrid
            products={memoizedFilteredData}
            viewMode={viewMode}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </div>

        {/* Cart Section */}
        {cart.length > 0 && (
          <div
            className={`vn-my-2 vn-bg-white ${
              showCartSummary
                ? "vn-w-full md:vn-w-1/3"
                : "lg:vn-w-1/3 vn-hidden lg:vn-block"
            }`}
          >
            <CartSummary
              cart={cart}
              onUpdateQuantity={(product, quantity) => {
                setCart((prevCart) =>
                  prevCart.map((item) =>
                    item.product.id === product.id
                      ? { ...item, quantity: item.quantity + quantity }
                      : item
                  )
                );
              }}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCatalogue;

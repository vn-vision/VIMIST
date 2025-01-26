import React, { useState } from "react";
import { useDisplayProducts } from "../../features/products/inventoryHook";
import { Product } from "../../utils/api/inventoryAPI";
import ProductGrid from "../../components/CatalogueView";
import ViewModeButtons from "../../components/ViewModeButtons";
import TopNavbar from "../../components/TopNavbar";

type ViewMode = "single" | "double" | "grid";

function ViewCatalogue() {
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const AllProducts = useDisplayProducts();

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
  console.log("My cart", cart);

  // handle search for a product
    // search for inventory by ID, Name, Category or Customer
    const handleSearch = (query: string | number) => {
        setSearchQuery(query);
        if (AllProducts.data) {
          const results = AllProducts.data?.filter(
            (inventory: any) =>
              inventory.id?.toString().includes(query.toString()) ||
              inventory.category?.toString().includes(query.toString()) ||
              inventory.name?.toLowerCase().includes(query.toString().toLowerCase())
          );
          setFilteredData(results);
        }
      };
    
  // Handle loading and error states
  if (AllProducts.status === "loading") {
    return <div>Loading...</div>;
  }

  if (AllProducts.error) {
    return <div>Error loading products: {AllProducts.error}</div>;
  }

  return (
    <div className="vn-min-h-screen vn-bg-gray-100 vn-p-4">
      {/* Header Section */}
      <div className="vn-flex vn-flex-col vn-justify-between vn-gap-4 vn-mb-4">
        <h1 className="vn-text-2xl vn-font-bold">Catalogue</h1>
        {/* Top Navbar */}
        <TopNavbar onSearch={handleSearch} />
        <ViewModeButtons viewMode={viewMode} onViewChange={setViewMode} />
      </div>


      {/* Product Grid Section */}
      <ProductGrid
        products={searchQuery ? filteredData : AllProducts.data}
        viewMode={viewMode}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
}

export default ViewCatalogue;

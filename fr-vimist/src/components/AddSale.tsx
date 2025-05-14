import { useMemo, useState, useEffect} from "react";
import GenericCard from "./GenericCard";
import { useDisplayProducts } from "../features/products/inventoryHook";
import { Product } from "../utils/api/inventoryAPI";
import CartSummary from "./Cart";
import useDebounce from "../features/hooks/useDebounce";
import CategoryFilter from "./CategoryFilter";
import TopNavbar from "./TopNavbar";

function AddSaleComponent() {
  // Fetch all products from the inventory
  const AllProducts = useDisplayProducts();

  const [addCart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [selectedCategory, setSelectedCategory] = useState<string|null>(null);
  const [filteredData, setFilteredData] = useState<Product[]>([]);

    // Using debounced search query
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Filter products by search query and category
  useEffect(() => {
    if (AllProducts.data){
      let filteredItems = AllProducts.data;

      // filter by category, name, id
      if (selectedCategory){
        filteredItems = filteredItems.filter(
          (item) => item.category === selectedCategory
        );
      }

      // filter by search query
      if (debouncedSearchQuery){
        filteredItems = filteredItems.filter((item)=>
          item.category?.toLowerCase().includes(debouncedSearchQuery.toString().toLowerCase()) ||
        item.name?.toString().includes(debouncedSearchQuery.toString().toLowerCase()) ||
        item.id?.toString().includes(debouncedSearchQuery.toString())
        );
      }
      setFilteredData(filteredItems);
    }
  }, [debouncedSearchQuery, AllProducts, selectedCategory])

  //  memoize filtered data for performance
  const memoizedFilteredData = useMemo(() => filteredData, [filteredData]);

  // handle search input
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
  }

  // handle category change, clearing the search query
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery(""); // clear search query when category changes
  }
  const handleAddToCart = (product: Product) => {
    // Check if the product is already in the cart
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        // If the product is already in the cart, increase the quantity
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (product: Product) => {
    // Remove the product from the cart
    const newCart = addCart.filter((item) => item.product.id !== product.id);
    setCart(newCart);
  };

  return (
    <div className="vn-flex vn-flex-col vn-gap-5">
      <div className="vn-flex-1 vn-flex-col ">
      <TopNavbar onSearch={handleSearch} />
      <CategoryFilter
      categories={AllProducts.data?.map((product) => product.category) ?? []}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      />
      </div>
      <div className="vn-flex vn-gap-5 vn-min-w-full vn-p-5 vn-bg-gray-100">
      {/* Scrollable Product Cards Section */}
      <div className="vn-grid sm:vn-grid-cols-1 md:vn-grid-cols-2 lg:vn-grid-cols-3 vn-gap-4 vn-min-w-[60%] vn-h-[70vh] vn-overflow-y-auto vn-p-2 vn-bg-white vn-rounded vn-shadow-md">
        {memoizedFilteredData.map((product) => (
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
            addToCart={() => handleAddToCart(product)}
            removeFromCart={() => handleRemoveFromCart(product)}
          />
        ))}
      </div>

      {/* Fixed Sales Summary Section */}
      {addCart.length > 0 &&
      <CartSummary
        cart={addCart}
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
}
    </div>
    </div>
  );
}

export default AddSaleComponent;

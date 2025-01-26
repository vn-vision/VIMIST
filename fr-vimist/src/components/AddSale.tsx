import { useState } from "react";
import GenericCard from "./GenericCard";
import { useDisplayProducts } from "../features/products/inventoryHook";
import { Product } from "../utils/api/inventoryAPI";
import CartSummary from "./Cart";

function AddSaleComponent() {
  // Fetch all products from the inventory
  const AllProducts = useDisplayProducts();

  const [addCart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );

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
    <div className="vn-flex vn-gap-5 vn-min-w-full vn-p-5 vn-bg-gray-100">
      {/* Scrollable Product Cards Section */}
      <div className="vn-grid sm:vn-grid-cols-1 md:vn-grid-cols-2 lg:vn-grid-cols-3 vn-gap-4 vn-w-[60%] vn-h-[70vh] vn-overflow-y-auto vn-p-2 vn-bg-white vn-rounded vn-shadow-md">
        {AllProducts.data.map((product) => (
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
    </div>
  );
}

export default AddSaleComponent;

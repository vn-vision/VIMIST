import { useState } from "react";
import GenericCard from "./GenericCard";
import { useDisplayProducts } from "../features/products/inventoryHook";
import { Product } from "../utils/api/inventoryAPI";
import { Sale } from "../utils/api/salesAPI";
import { useAddNewSale } from "../features/sales/salesHook";

function AddSaleComponent() {
  // Fetch all products from the inventory
  const AllProducts = useDisplayProducts();

  // fetch add sale function
  const {addSale} = useAddNewSale();

  const [addCart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [logPayment, setLogPayment] = useState<string>('Cash');

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

  const handleDecrementItem = (product: Product) => {
    // Decrease the quantity of the product in the cart
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === product.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateSubtotal = () => {
    return addCart
      .reduce(
        (acc, item) =>
          acc +
          (isNaN(Number(item.product.unit_price))
            ? 0
            : Number(item.product.unit_price)),
        0
      )
      .toFixed(2);
  };

  const calculateTax = (subtotal: number) => {
    const taxRate = 0.16; // 16% VAT
    return (subtotal * taxRate).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax(subtotal));
    return (subtotal + tax).toFixed(2);
  };


  const handleRecordSale = (paymentType: string) => {
    addCart.map((item, index)=>({
      id: index,
      product: item.product.id,
      quantity_sold: item.quantity,
      sale_price: item.product.unit_price,
      sale_date: new Date().toISOString().split("T")[0],
      customer: null,
      payment_type: paymentType
    }))
    .forEach((sale) => addSale(sale));
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
      <div className="vn-flex vn-flex-col vn-gap-5 vn-w-[30%] vn-bg-white vn-shadow-md vn-rounded vn-p-5">
        {/* Item Summary */}
        <div className="vn-flex vn-flex-col vn-gap-3">
          {addCart.map((item) => (
            <div
              key={item.product.id}
              className="vn-flex vn-justify-between vn-items-center"
            >
              <span>
                {item.product.name} X {item.quantity}
              </span>
              <div className="vn-flex vn-gap-2">
                <button
                  className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400"
                  onClick={() => handleAddToCart(item.product)}
                >
                  +
                </button>
                <button
                  className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400"
                  onClick={() => handleDecrementItem(item.product)}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="vn-border-t vn-border-gray-200 vn-pt-3">
          <div className="vn-flex vn-justify-between">
            <span>Subtotal:</span>
            <span>{calculateSubtotal()}</span>
          </div>
          <div className="vn-flex vn-justify-between">
            <span>Tax:</span>
            <span>{calculateTax(parseFloat(calculateSubtotal()))}</span>
          </div>
          <div className="vn-flex vn-justify-between vn-font-bold">
            <span>Total:</span>
            <span>{calculateTotal()}</span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="vn-flex vn-gap-3 vn-mt-4">
          <button className="vn-w-1/2 vn-bg-green-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-green-600"
          onClick={()=>setLogPayment('Mpesa')}>
            Mpesa
          </button>
          <button className="vn-w-1/2 vn-bg-blue-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-blue-600"
          onClick={()=>setLogPayment('Mpesa')}>
            Cash
          </button>
          <button className="vn-w-1/2 vn-bg-yellow-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-yellow-600"
          onClick={()=>setLogPayment('Credit')}>
            Credit
          </button>
        </div>
        <button
          className="vn-w-1/2 vn-bg-orange-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-orange-600 vn-m-auto"
          onClick={() => {
            console.log(addCart);
            handleRecordSale(logPayment);
          }}
        >
          Log Cart
        </button>
      </div>
    </div>
  );
}

export default AddSaleComponent;

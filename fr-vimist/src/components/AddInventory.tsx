import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewProduct } from "../features/products/inventoryHook";
import { Product } from "../api/inventoryAPI";

function AddInventory({ reset }: { reset: () => void }) {
  const navigate = useNavigate();
  
  // Add a new product
  const { addProduct, status,  } = useAddNewProduct();

  // State for a new product
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    category: "",
    unit_price: 0,
    quantity_in_stock: 0,
    reorder_level: 0,
  });

  const [productImage, setProductImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productImage) {
      alert("Please upload an image.");
      return;
    }

    setIsSubmitting(true);

    // Prepare product data, including the image if necessary
    const productData = {
      ...newProduct,
      image: productImage, // Optional: Include the image in your logic
    };

    addProduct(productData);

    // Reset form
    setNewProduct({
      id: 0,
      name: "",
      category: "",
      unit_price: 0,
      quantity_in_stock: 0,
      reorder_level: 0,
    });
    setProductImage(null);

    if (status === 'succeeded') {
      reset();
      navigate("/inventory"); // Redirect to inventory or refresh the page
    }
    setIsSubmitting(false);
  };

  const handleDiscard = () => {
    setNewProduct({
      id: 0,
      name: "",
      category: "",
      unit_price: 0,
      quantity_in_stock: 0,
      reorder_level: 0,
    });
    setProductImage(null);
  };

  return (
    <div className="vn-flex vn-justify-center vn-items-center vn-bg-gray-100 vn-h-full">
      <form
        onSubmit={handleAddProduct}
        className="vn-grid vn-grid-cols-2 vn-gap-4 vn-bg-white vn-shadow-md vn-rounded vn-p-6 vn-max-w-lg"
      >
        <label htmlFor="category" className="vn-font-bold">
          Category:
        </label>
        <input
          id="category"
          type="text"
          placeholder="Cereals"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="name" className="vn-font-bold">
          Name:
        </label>
        <input
          id="name"
          type="text"
          placeholder="Rice"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="price" className="vn-font-bold">
          Price:
        </label>
        <input
          id="price"
          type="number"
          placeholder="120.00"
          value={newProduct.unit_price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              unit_price: parseFloat(e.target.value) || 0,
            })
          }
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="quantity" className="vn-font-bold">
          Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          placeholder="20"
          value={newProduct.quantity_in_stock}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              quantity_in_stock: parseInt(e.target.value, 10) || 0,
            })
          }
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="reorder-level" className="vn-font-bold">
          Re-Order Level:
        </label>
        <input
          id="reorder-level"
          type="number"
          placeholder="20"
          value={newProduct.reorder_level}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              reorder_level: parseInt(e.target.value, 10) || 0,
            })
          }
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="image" className="vn-font-bold">
          Image:
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              // Optional: Add file size/type validation here
              setProductImage(file);
            }
          }}
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <button
          type="submit"
          className={`vn-col-span-2 vn-bg-blue-500 vn-text-white vn-rounded vn-py-2 vn-font-bold vn-hover:bg-blue-600 ${isSubmitting && "vn-bg-blue-300"}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={handleDiscard}
          className="vn-col-span-2 vn-bg-gray-500 vn-text-white vn-rounded vn-py-2 vn-font-bold vn-hover:bg-gray-600"
        >
          Discard
        </button>
      </form>
    </div>
  );
}

export default AddInventory;

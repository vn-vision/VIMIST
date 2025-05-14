import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddNewProduct,
  useUpdateProduct,
} from "../features/products/inventoryHook";
import { Product } from "../utils/api/inventoryAPI";
import AlertMessage from "./AlertMessage";
import { useClearMessages } from "../features/products/inventoryHook";
interface AddInventoryProps {
  reset: () => void;
  itemId: number | null;
}

const defaultProductState: Product = {
  id: 0,
  name: "",
  category: "",
  unit_price: 0,
  quantity_in_stock: 0,
  reorder_level: 0,
  image: null,
};

const ProductForm = ({
  product,
  handleChange,
  handleSubmit,
  isSubmitting,
  buttonLabel,
  discard,
  showImageUpload,
  setImage,
}: {
  product: Product;
  handleChange: (field: string, value: string | number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  buttonLabel: string;
  discard: () => void;
  showImageUpload?: boolean;
  setImage?: (file: File | null) => void;
}) => (
  <form
    onSubmit={handleSubmit}
    className="vn-grid vn-grid-cols-2 vn-gap-4 vn-bg-white vn-shadow-md vn-rounded vn-p-6 vn-max-w-lg"
  >
    <label className="vn-font-bold">Category:</label>
    <input
      type="text"
      value={product.category}
      onChange={(e) => handleChange("category", e.target.value)}
      required
      className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
    />

    <label className="vn-font-bold">Name:</label>
    <input
      type="text"
      value={product.name}
      onChange={(e) => handleChange("name", e.target.value)}
      required
      className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
    />

    <label className="vn-font-bold">Price:</label>
    <input
      type="number"
      value={product.unit_price}
      onChange={(e) =>
        handleChange("unit_price", parseFloat(e.target.value) || 0)
      }
      required
      className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
    />

    <label className="vn-font-bold">Quantity:</label>
    <input
      type="number"
      value={product.quantity_in_stock}
      onChange={(e) =>
        handleChange("quantity_in_stock", parseInt(e.target.value, 10) || 0)
      }
      required
      className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
    />

    <label className="vn-font-bold">Reorder Level:</label>
    <input
      type="number"
      value={product.reorder_level}
      onChange={(e) =>
        handleChange("reorder_level", parseInt(e.target.value, 10) || 0)
      }
      required
      className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
    />

    {showImageUpload && setImage && (
      <>
        <label className="vn-font-bold">Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setImage(file);
            }
          }}
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />
      </>
    )}

    <button
      type="submit"
      className={`vn-col-span-2 vn-bg-primary vn-text-white vn-rounded vn-py-2 vn-font-bold vn-hover:bg-blue-600 ${
        isSubmitting && "vn-bg-blue-300"
      }`}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Saving..." : buttonLabel}
    </button>

    <button
      type="button"
      onClick={discard}
      className="vn-col-span-2 vn-bg-gray-500 vn-text-white vn-rounded vn-py-2 vn-font-bold vn-hover:bg-gray-600"
    >
      Discard
    </button>
  </form>
);

function AddInventory({ reset, itemId }: AddInventoryProps) {
  const navigate = useNavigate();
  const {
    addProduct,
    error: addError,
    message: addMessage,
  } = useAddNewProduct();
  const {
    updateProduct,
    error: updateError,
  } = useUpdateProduct();
  const { clsMessages } = useClearMessages();

  const [product, setProduct] = useState<Product>(defaultProductState);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // if the id is provide, fetch the product details and set the state
  // this is to allow updating of the product
  const handleInputChange = (field: string, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      ...(itemId ? { id: itemId } : {}),
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!itemId) {
      if (!productImage) {
        alert("Please upload an image.");
        setIsSubmitting(false);
        return;
      }

      // form data to allow file submission
      const formData = new FormData();

      // append to the form Data for submission
      formData.append("category", product.category);
      formData.append("name", product.name);
      formData.append("unit_price", product.unit_price.toString());
      formData.append(
        "quantity_in_stock",
        product.quantity_in_stock.toString()
      );
      formData.append("reorder_level", product.reorder_level.toString());
      formData.append("image", productImage);

      addProduct(formData);
    } else {
      updateProduct(product);
    }
    setProduct(defaultProductState);
    setProductImage(null);
    setIsSubmitting(false);
  };
  
  return (
    <div className="vn-flex vn-justify-center vn-items-center vn-flex-col vn-bg-gray-100 vn-h-full">
           {addError && (
        <AlertMessage
          message={addError.toString()}
          type="error"
          onClose={clsMessages}
        />
      )}
      {addMessage && (
        <AlertMessage
          message={addMessage}
          type="success"
          onClose={clsMessages}
        />
      )}
      {updateError && (
        <AlertMessage
          message={updateError.toString()}
          type="error"
          onClose={clsMessages}
        />
      )}
      {addMessage && (
        <AlertMessage
          message={addMessage}
          type="success"
          onClose={clsMessages}
        />
      )}
      <button
        className="vn-text-2xl vn-font-bold vn-bg-secondary"
        onClick={() => reset()}
      >
        {"<<"} Back
      </button>
      <h1 className="vn-text-2xl vn-font-bold vn-mb-5 vn-text-red-500">
        {addError
          ? addError.toString()
          : updateError
          ? updateError.toString()
          : ""}
      </h1>
      <ProductForm
        product={product}
        handleChange={handleInputChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        buttonLabel={itemId ? "Update Product" : "Save"}
        discard={() => setProduct(defaultProductState)}
        showImageUpload={!itemId}
        setImage={setProductImage}
      />
    </div>
  );
}

export default AddInventory;

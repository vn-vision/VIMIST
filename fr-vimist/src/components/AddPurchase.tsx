import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddPurchase() {
    const navigate = useNavigate();

  // Define the state type
  interface FormData {
    category: string;
    item: string;
    description: string;
    price: string;
    quantity: string;
    image: File | null; // Allow image to be null or a File object
  }

  // Initialize state with the correct type
  const [formData, setFormData] = useState<FormData>({
    category: '',
    item: '',
    description: '',
    price: '',
    quantity: '',
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value })); // Update other fields
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    // Add further processing logic here
    alert('Inventory item saved successfully!');
  };

  const handleDiscard = () => {
    setFormData({
      category: '',
      item: '',
      description: '',
      price: '',
      quantity: '',
      image: null,
    });
    alert('Form discarded!');
    navigate("/");
  };

  return (
    <div className="vn-flex vn-justify-center vn-items-center vn-bg-gray-100 vn-h-full">
      <form
        onSubmit={handleSubmit}
        className="vn-grid vn-grid-cols-2 vn-gap-4 vn-bg-white vn-shadow-md vn-rounded vn-p-6 vn-max-w-lg"
      >
        <label htmlFor="category" className="vn-font-bold">
          Category:
        </label>
        <input
          id="category"
          type="text"
          placeholder="Cereals"
          value={formData.category}
          onChange={handleChange}
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="item" className="vn-font-bold">
          Item:
        </label>
        <input
          id="item"
          type="text"
          placeholder="Rice"
          value={formData.item}
          onChange={handleChange}
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="description" className="vn-font-bold">
          Description:
        </label>
        <input
          id="description"
          type="text"
          placeholder="Sindano"
          value={formData.description}
          onChange={handleChange}
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
          value={formData.price}
          onChange={handleChange}
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
          value={formData.quantity}
          onChange={handleChange}
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <label htmlFor="image" className="vn-font-bold">
          Supplier:
        </label>
        <input
          id="supplier"
          type="text"
          placeholder='Magunas'
          onChange={handleChange}
          required
          className="vn-border vn-border-gray-300 vn-rounded vn-p-2"
        />

        <button
          type="submit"
          className="vn-col-span-2 vn-bg-blue-500 vn-text-white vn-rounded vn-py-2 vn-font-bold vn-hover:bg-blue-600"
        >
          Save
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

export default AddPurchase;

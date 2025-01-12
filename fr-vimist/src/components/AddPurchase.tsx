import React, { useEffect, useState } from "react";
import { useDisplayProducts } from "../features/products/inventoryHook";
import { useDisplayPurchases, useAddNewPurchase, useUpdatePurchase } from "../features/purchases/purchaseHook";
import { Product } from "../utils/api/inventoryAPI";
import { Purchase } from "../utils/api/purchasesAPI";

interface AddPurchaseProps {
  reset: () => void;
  itemId: number | null;
}

function AddPurchase({reset, itemId}:AddPurchaseProps) {

  // Fetch data from hook
  const { data: products } = useDisplayProducts();


  // Add purchase
  const { addPurchase } = useAddNewPurchase();
  // Update purchase
  const { updatePurchase } = useUpdatePurchase();

  // get purchase that matches the id
  const { data: allPurchases } = useDisplayPurchases();
  const selectPurchase = allPurchases?.find((purchase: Purchase) => purchase.product === itemId);

  // State to hold form data
  const [formData, setFormData] = useState<Purchase>({
    id: 0,
    product: 0,
    quantity_purchased: 0,
    purchase_price: 0,
    supplier: "",
    purchase_date: new Date().toISOString().split("T")[0],
    payment_type: "Cash",
  });

 // if itemId is not null, set the form data to the selected purchase
 useEffect(() => {
  if (selectPurchase){
    setFormData({
      id: selectPurchase.id,
      product: selectPurchase.product,
      quantity_purchased: selectPurchase.quantity_purchased,
      purchase_price: selectPurchase.purchase_price,
      supplier: selectPurchase.supplier,
      purchase_date: selectPurchase.purchase_date,
      payment_type: selectPurchase.payment_type,
    })
  }
 }, [selectPurchase]);

  // State to handle errors and success messages
  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>("");

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    if (id === "inventory") {
      const selectedProduct = products.find(
        (product: Product) => product.name === value
      );
      setFormData({ ...formData, product: selectedProduct?.id || 0 });
    } else {
      setFormData({ ...formData, [id]: value });
    }

    // Clear individual field error
    if (error[id]) {
      setError({ ...error, [id]: "" });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.product) newErrors.inventory = "Please select a product.";
    if (!formData.quantity_purchased)
      newErrors.quantity_purchased = "Quantity is required.";
    if (!formData.purchase_price)
      newErrors.purchase_price = "Purchase price is required.";
    if (!formData.supplier) newErrors.supplier = "Supplier is required.";
    if (!formData.purchase_date)
      newErrors.purchase_date = "Purchase date is required.";
    if (!formData.payment_type)
      newErrors.payment_type = "Payment type is required.";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      if (itemId){
        updatePurchase(formData)
          setSuccess("Purchase updated successfully.");
          reset()
      } else
      {
        addPurchase(formData)
          setSuccess("Purchase added successfully.");
          setFormData({
            id: 0,
            product: 0,
            quantity_purchased: 0,
            purchase_price: 0,
            supplier: "",
            purchase_date: new Date().toISOString().split("T")[0],
            payment_type: "Cash",
          });
          reset();
        }
    } catch (error: any){
      setError({ general: error.message });
  }
  };

  return (
    <div className="vn-p-4 vn-max-w-md vn-mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Product Selection */}
        <div className="vn-mb-4">
          <label htmlFor="inventory" className="vn-block vn-text-sm vn-font-medium">
            Products
          </label>
          <input
            id="inventory"
            list="products"
            placeholder="Select Product"
            value={
              products?.find((product: Product) => product.id === formData.product)
                ?.name || ""
            }
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${
              error.inventory ? "vn-border-red-500" : ""
            }`}
          />
          <datalist id="products">
            {products?.map((product: Product) => (
              <option key={product.id} value={product.name}></option>
            ))}
          </datalist>
          {error.inventory && <div className="vn-text-red-500">{error.inventory}</div>}
        </div>

        {/* Quantity */}
        <div className="vn-mb-4">
          <label htmlFor="quantity_purchased" className="vn-block vn-text-sm vn-font-medium">
            Quantity
          </label>
          <input
            id="quantity_purchased"
            type="number"
            placeholder="Enter Quantity"
            value={formData.quantity_purchased}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${
              error.quantity_purchased ? "vn-border-red-500" : ""
            }`}
          />
          {error.quantity_purchased && (
            <div className="vn-text-red-500">{error.quantity_purchased}</div>
          )}
        </div>

        {/* Price */}
        <div className="vn-mb-4">
          <label htmlFor="purchase_price" className="vn-block vn-text-sm vn-font-medium">
            Price
          </label>
          <input
            id="purchase_price"
            type="number"
            placeholder="Enter Price"
            value={formData.purchase_price}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${
              error.purchase_price ? "vn-border-red-500" : ""
            }`}
          />
          {error.purchase_price && (
            <div className="vn-text-red-500">{error.purchase_price}</div>
          )}
        </div>

        {/* Supplier */}
        <div className="vn-mb-4">
          <label htmlFor="supplier" className="vn-block vn-text-sm vn-font-medium">
            Supplier
          </label>
          <input
            id="supplier"
            type="text"
            placeholder="Enter Supplier"
            value={formData.supplier}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${
              error.supplier ? "vn-border-red-500" : ""
            }`}
          />
          {error.supplier && <div className="vn-text-red-500">{error.supplier}</div>}
        </div>

        {/* Date */}
        <div className="vn-mb-4">
          <label htmlFor="purchase_date" className="vn-block vn-text-sm vn-font-medium">
            Date
          </label>
          <input
            id="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${
              error.purchase_date ? "vn-border-red-500" : ""
            }`}
          />
          {error.purchase_date && (
            <div className="vn-text-red-500">{error.purchase_date}</div>
          )}
        </div>

        {/* Payment Type */}
        <div className="vn-mb-4">
          <label htmlFor="payment_type" className="vn-block vn-text-sm vn-font-medium">
            Payment Type
          </label>
          <select
            id="payment_type"
            value={formData.payment_type}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${
              error.payment_type ? "vn-border-red-500" : ""
            }`}
          >
            <option value="Cash">Cash</option>
            <option value="Mpesa">Mpesa</option>
            <option value="Credit">Credit</option>
          </select>
          {error.payment_type && (
            <div className="vn-text-red-500">{error.payment_type}</div>
          )}
        </div>

        {/* Error & Success Messages */}
        {error.general && <div className="vn-text-red-500">{error.general}</div>}
        {success && <div className="vn-text-green-500">{success}</div>}

        {/* Submit & Cancel Buttons */}
        <div className="vn-flex vn-justify-between">
          <button
            type="submit"
            className="vn-bg-green-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-green-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                id: 0,
                product: 0,
                quantity_purchased: 0,
                purchase_price: 0,
                supplier: "",
                purchase_date: new Date().toISOString().split("T")[0],
                payment_type: "Cash",
              })
            }
            className="vn-bg-red-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPurchase;

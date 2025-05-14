import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDisplayProducts } from "../features/products/inventoryHook";
import {
  useDisplayPurchases,
  useAddNewPurchase,
  useUpdatePurchase,
  useClearMessages,
} from "../features/purchases/purchaseHook";
import { Purchase } from "../utils/api/purchasesAPI";
import AlertMessage from "./AlertMessage";

interface AddPurchaseProps {
  reset: () => void;
  itemId: number | null;
}

function AddPurchase({ reset, itemId }: AddPurchaseProps) {
  const { data: products } = useDisplayProducts();
  const { addPurchase, error: addError, message: addMsg } = useAddNewPurchase();
  const { updatePurchase, error: updateError, message: updMsg } = useUpdatePurchase();
  const {clsMessages} = useClearMessages();
  const { data: allPurchases } = useDisplayPurchases();

  // Memoize selected purchase
  const selectPurchase = useMemo(
    () => allPurchases?.find((purchase) => purchase.product === itemId),
    [allPurchases, itemId]
  );

  // State for form data
  const [formData, setFormData] = useState<Purchase>({
    id: 0,
    product: 0,
    quantity_purchased: 0,
    purchase_price: 0,
    supplier: "",
    purchase_date: new Date().toISOString().split("T")[0],
    payment_type: "Cash",
  });

  // Populate form data when an item is selected
  useEffect(() => {
    if (selectPurchase) {
      setFormData({ ...selectPurchase });
    }
  }, [selectPurchase]);

  const [error, setError] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>("");

  // Memoize product name lookup
  const selectedProductName = useMemo(
    () => products?.find((product) => product.id === formData.product)?.name || "",
    [products, formData.product]
  );

  // Handle form field changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;

      setFormData((prev) => {
        if (id === "inventory") {
          const selectedProduct = products.find((p) => p.name === value);
          return { ...prev, product: selectedProduct?.id || 0 };
        }
        return { ...prev, [id]: value };
      });

      if (error[id]) setError((prev) => ({ ...prev, [id]: "" }));
    },
    [products, error]
  );

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.product) newErrors.inventory = "Please select a product.";
    if (!formData.quantity_purchased) newErrors.quantity_purchased = "Quantity is required.";
    if (!formData.purchase_price) newErrors.purchase_price = "Purchase price is required.";
    if (!formData.supplier) newErrors.supplier = "Supplier is required.";
    if (!formData.purchase_date) newErrors.purchase_date = "Purchase date is required.";
    if (!formData.payment_type) newErrors.payment_type = "Payment type is required.";
    return newErrors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setError(newErrors);
        return;
      }

      try {
        if (itemId) {
          updatePurchase(formData);
        } else {
          addPurchase(formData);
          setFormData({
            id: 0,
            product: 0,
            quantity_purchased: 0,
            purchase_price: 0,
            supplier: "",
            purchase_date: new Date().toISOString().split("T")[0],
            payment_type: "Cash",
          });
        }
        setSuccess("Purchase updated successfully.");
      } catch (error: any) {
        setError({ general: error.message });
      }
    },
    [formData, itemId, updatePurchase, addPurchase, validateForm]
  );

  return (
    <div className="vn-p-4 vn-max-w-md vn-mx-auto">
      <button className="vn-bg-secondary" onClick={reset}>
        {"<< "}Back
      </button>
      {addError && <AlertMessage message={addError.toString()} type="error" onClose={clsMessages}/> }
      {addMsg && <AlertMessage message={addMsg} type="success" onClose={clsMessages}/> }
      
      {updateError && <AlertMessage message={updateError.toString()} type="error" onClose={clsMessages}/> }
      {updMsg && <AlertMessage message={updMsg} type="success" onClose={clsMessages}/> }

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
            value={selectedProductName}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${error.inventory ? "vn-border-red-500" : ""}`}
          />
          <datalist id="products">
            {products?.map((product) => (
              <option key={product.id} value={product.name}></option>
            ))}
          </datalist>
          {error.inventory && <div className="vn-text-red-500">{error.inventory}</div>}
        </div>

        {/* Quantity, Price, Supplier, Date, Payment Type Fields */}
        {["quantity_purchased", "purchase_price", "supplier", "purchase_date"].map((field) => (
          <div key={field} className="vn-mb-4">
            <label htmlFor={field} className="vn-block vn-text-sm vn-font-medium">
              {field.replace("_", " ")}
            </label>
            <input
              id={field}
              type={field.includes("date") ? "date" : "text"}
              placeholder={`Enter ${field.replace("_", " ")}`}
              value={formData[field as keyof Purchase] as string}
              onChange={handleChange}
              className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${error[field] ? "vn-border-red-500" : ""}`}
            />
            {error[field] && <div className="vn-text-red-500">{error[field]}</div>}
          </div>
        ))}

        {/* Payment Type Dropdown */}
        <div className="vn-mb-4">
          <label htmlFor="payment_type" className="vn-block vn-text-sm vn-font-medium">
            Payment Type
          </label>
          <select
            id="payment_type"
            value={formData.payment_type}
            onChange={handleChange}
            className={`vn-w-full vn-border vn-rounded vn-px-2 vn-py-1 ${error.payment_type ? "vn-border-red-500" : ""}`}
          >
            {["Cash", "Mpesa", "Credit"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {error.payment_type && <div className="vn-text-red-500">{error.payment_type}</div>}
        </div>

        {/* Success Message */}
        {success && <div className="vn-text-green-500">{success}</div>}

        {/* Submit Button */}
        <button type="submit" className="vn-bg-primary vn-text-white vn-px-4 vn-py-2 vn-rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default React.memo(AddPurchase);

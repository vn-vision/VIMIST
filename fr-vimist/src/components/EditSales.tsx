import React, { useEffect, useState } from "react";
import { useFetchSaleById, useUpdateSale, useClearMessages } from "../features/sales/salesHook";
import { Sale } from "../utils/api/salesAPI";
import AlertMessage from "./AlertMessage";

// create interface for the props
interface EditSalesProps {
  reset: () => void;
  itemId: number | null;
}

function EditSales({ reset, itemId }: EditSalesProps) {
  // create state for the sale
  const [sale, setSale] = useState<Sale>({
    id: 0,
    product: 0,
    quantity_sold: 0,
    sale_price: 0,
    sale_date: new Date().toISOString().split("T")[0],
    customer: "",
    payment_type: "Cash",
  });

  // create state for the error
  const [editError, setError] = useState<Record<string, string>>({});
  // create constant to get the sale by id

  const { data: singleSale, message: saleMsg, error: saleErr } = useFetchSaleById(itemId!);

  // create constant to update the sale
  const { updateSale, message: updMsg, error: updErr } = useUpdateSale();
  const { clsMessages } = useClearMessages();

  // set state for the sale
  useEffect(() => {
    if (singleSale && singleSale.length > 0) {
      setSale(singleSale[0]);
    }
  }, [singleSale]);

  // function to handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSale({ ...sale!, [id]: value });
  };

  // function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (sale !== null) {
        updateSale(sale);
        reset();
      }
    } catch (error: any) {
      setError({ general: error.message });
    }
  };

  return (
    <div className="vn-p-4 vn-max-w-md vn-mx-auto">
      {saleErr && <AlertMessage message={saleErr.toString()} type="error" onClose={clsMessages} />}
      {saleMsg && <AlertMessage message={saleMsg} type="success" onClose={clsMessages} />}
      {updErr && <AlertMessage message={updErr.toString()} type="error" onClose={clsMessages} />}
      {updMsg && <AlertMessage message={updMsg} type="success" onClose={clsMessages} />}
      
      <h2 className="vn-text-center vn-text-lg vn-font-bold vn-mb-4">
        Edit Sale
      </h2>
        {editError.general && (
            <div className="vn-text-red-500 vn-text-center vn-mb-4">
            {editError.general}
            </div>
        )}
      <form onSubmit={handleSubmit}>
        <div className="vn-mb-4">
          <label htmlFor="product" className="vn-block vn-mb-1">
            Product
          </label>
          <input
            type="text"
            id="product"
            value={sale.product}
            onChange={handleChange}
            className="vn-w-full vn-py-2 vn-px-3 vn-border vn-rounded"
          />
        </div>
        <div className="vn-mb-4">
          <label htmlFor="quantity_sold" className="vn-block vn-mb-1">
            Quantity Sold
          </label>
          <input
            type="number"
            id="quantity_sold"
            value={sale.quantity_sold}
            onChange={handleChange}
            className="vn-w-full vn-py-2 vn-px-3 vn-border vn-rounded"
          />
        </div>
        <div className="vn-mb-4">
          <label htmlFor="sale_price" className="vn-block vn-mb-1">
            Sale Price
          </label>
          <input
            type="number"
            id="sale_price"
            value={sale.sale_price}
            onChange={handleChange}
            className="vn-w-full vn-py-2 vn-px-3 vn-border vn-rounded"
          />
        </div>
        <div className="vn-mb-4">
          <label htmlFor="sale_date" className="vn-block vn-mb-1">
            Sale Date
          </label>
          <input
            type="date"
            id="sale_date"
            value={sale.sale_date}
            onChange={handleChange}
            className="vn-w-full vn-py-2 vn-px-3 vn-border vn-rounded"
          />
        </div>
        <div className="vn-mb-4">
          <label htmlFor="customer" className="vn-block vn-mb-1">
            Customer
          </label>
          <input
            type="text"
            id="customer"
            value={sale.customer ? sale.customer : ""}
            onChange={handleChange}
            className="vn-w-full vn-py-2 vn-px-3 vn-border vn-rounded"
          />
        </div>
        <div className="vn-mb-4">
          <label htmlFor="payment_type" className="vn-block vn-mb-1">
            Payment Type
          </label>
          <select
            id="payment_type"
            value={sale.payment_type}
            onChange={handleChange}
            className="vn-w-full vn-py-2 vn-px-3 vn-border vn-rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>
        <div className="vn-mb-4">
          <button
            type="submit"
            className="vn-w-full vn-py-2 vn-bg-primary vn-text-white vn-rounded"
          >
            Update Sale
          </button>
          <button
            type="button"
            onClick={reset}
            className="vn-w-full vn-py-2 vn-bg-red-500 vn-text-white vn-rounded vn-mt-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSales;

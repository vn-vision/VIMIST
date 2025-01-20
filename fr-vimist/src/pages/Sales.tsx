import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddSaleComponent from "../components/AddSale";
import { useFetchSales, useDeleteSale } from "../features/sales/salesHook";
import CreditSaleComponent from "./CreditSaleComponent";
import EditSales from "../components/EditSales";

const headers = [
  "ID",
  "Product",
  "Quantity_Sold",
  "Total_Price",
  "Payment_Type",
  "Sale_Date",
  "Customer",
];

const Sales = () => {
  // get data from the hook
  const { data } = useFetchSales();
  const [view, setView] = useState<"table" | "addSale" | "creditSale">("table");
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // edit a product
  const handleEdit = (id: number) => {
    setEditItemId(id);
    <EditSales itemId={editItemId} reset={() => setEditItemId(0)} />
  };
  // delete a product by its ID
  const { deleteSale } = useDeleteSale();

  // Handler for view switching
  const handleViewChange = (newView: "table" | "addSale" | "creditSale") => {
    setView((currentView) => (currentView === newView ? "table" : newView));
  };

  // search for sale by ID, Name, Category or Customer
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
    if (data) {
      const results = data?.filter(
        (sale: any) =>
          sale.id?.toString().includes(query.toString()) ||
          sale.product?.toString().includes(query.toString()) ||
          sale.customer
            ?.toLowerCase()
            .includes(query.toString().toLowerCase()) ||
          sale.payment_type
            ?.toLowerCase()
            .includes(query.toString().toLowerCase())
      );
      setFilteredData(results);
    }
  };

  return (
    <div className="vn-mt-5 vn-p-5">
      <h1 className="vn-text-2xl vn-font-bold vn-mb-5">Sales</h1>
      {/* TopNavbar */}
      <TopNavbar onSearch={handleSearch} />

      {/* Quick Actions */}
      <div className="vn-flex vn-justify-around vn-my-5">
        <button
          className={`vn-px-4 vn-py-2 vn-rounded vn-bg-gray-200 ${
            view === "table"
              ? "vn-bg-blue-400 vn-text-white"
              : "hover:vn-bg-gray-300"
          }`}
          onClick={() => handleViewChange("table")}
        >
          View Sales
        </button>
        <button
          className={`vn-px-4 vn-py-2 vn-rounded vn-bg-gray-200 ${
            view === "addSale"
              ? "vn-bg-blue-400 vn-text-white"
              : "hover:vn-bg-gray-300"
          }`}
          onClick={() => handleViewChange("addSale")}
        >
          Add Sale
        </button>
        <button
          className={`vn-px-4 vn-py-2 vn-rounded vn-bg-gray-200 ${
            view === "creditSale"
              ? "vn-bg-blue-400 vn-text-white"
              : "hover:vn-bg-gray-300"
          }`}
          onClick={() => handleViewChange("creditSale")}
        >
          Credit Sale
        </button>
      </div>

      {/* Conditional Rendering */}
      <div className="vn-mt-5">
        {view === "table" && (
          <DynamicTable
            headers={headers}
            data={
              Array.isArray(filteredData) &&
              searchQuery &&
              filteredData.length > 0
                ? filteredData
                : Array.isArray(data)
                ? data
                : []
            }
            onEdit={handleEdit}
            onDelete={deleteSale}
          />
        )}
        {view === "addSale" && <AddSaleComponent />}
        {view === "creditSale" && <CreditSaleComponent />}
        {editItemId && <EditSales itemId={editItemId} reset={() => setEditItemId(0)} />}
      </div>
    </div>
  );
};

export default Sales;

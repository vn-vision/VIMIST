import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddSaleComponent from "../components/AddSale";
import { useFetchSales, useDeleteSale, useClearMessages } from "../features/sales/salesHook";
import CreditSaleComponent from "../components/CreditSaleComponent";
import EditSales from "../components/EditSales";
import { FaDollarSign } from "react-icons/fa";
import AlertMessage from "../components/AlertMessage";

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
  const { data } = useFetchSales();
  const [view, setView] = useState<"table" | "addSale" | "creditSale">("table");
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Handle editing a sale
  const handleEdit = (id: number) => {
    setEditItemId(id);
  };

  // Delete sale hook
  const { deleteSale, message: delMessage, error: delError } = useDeleteSale();
  const { clsMessages } = useClearMessages();
  // View switching logic
  const handleViewChange = (newView: "table" | "addSale" | "creditSale") => {
    setView((currentView) => (currentView === newView ? "table" : newView));
  };

  // Search filter function
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
    if (data) {
      const results = data.filter(
        (sale: any) =>
          sale.id?.toString().includes(query.toString()) ||
          sale.product?.toLowerCase().includes(query.toString().toLowerCase()) ||
          sale.customer?.toLowerCase().includes(query.toString().toLowerCase()) ||
          sale.payment_type?.toLowerCase().includes(query.toString().toLowerCase())
      );
      setFilteredData(results);
    }
  };

  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-p-5">
      {delError && <AlertMessage message={delError} type="error" onClose={clsMessages} />}
      {delMessage && <AlertMessage message={delMessage} type="success" onClose={clsMessages} />}
      <h1 className="vn-text-2xl vn-font-bold">Sales Management</h1>

      {/* Search Bar (Only in Table View) */}

      {/* Quick Action Buttons */}
      <div className="vn-flex vn-justify-center vn-gap-4">
        {["table", "addSale", "creditSale"].map((option) => (
          <button
            key={option}
            className={`vn-px-5 vn-py-2 vn-rounded-lg vn-font-medium vn-transition-all vn-border ${
              view === option
                ? "vn-text-secondary vn-text-black vn-shadow-md"
                : "vn-text-primary vn-text-gray-700"
            }`}
            onClick={() => handleViewChange(option as "table" | "addSale" | "creditSale")}
          >
            {option === "table" ? "View Sales" : option === "addSale" ? (<p className="vn-flex vn-gap-3 vn-items-center">{<FaDollarSign />}Add Sale</p>)  : "Credit Sale"}
          </button>
        ))}
      </div>
      {view === "table" && <TopNavbar onSearch={handleSearch} />}
      {/* View Content */}
      <div className="vn-mt-8 vn-transition-all">
        {view === "table" && (
          <DynamicTable
            headers={headers}
            data={searchQuery && filteredData.length > 0 ? filteredData : data || []}
            onEdit={handleEdit}
            onDelete={deleteSale}
          />
        )}
        {view === "addSale" && <AddSaleComponent />}
        {view === "creditSale" && <CreditSaleComponent />}
        {editItemId !== null && (
          <EditSales itemId={editItemId} reset={() => setEditItemId(null)} />
        )}
      </div>
    </div>
  );
};

export default Sales;

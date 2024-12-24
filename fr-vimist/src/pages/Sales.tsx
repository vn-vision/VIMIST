import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
// import TopNavbar from "../components/TopNavbar";
import AddSaleComponent from "../components/AddSale";
import CreditSaleComponent from "./CreditSaleComponent";

const headers = ["ID", "ITEM", "CATEGORY", "PRICE", "QUANTITY", "DATE"];
const data = [
  { id: 1, item: "Laptop", category: "Electronics", price: 1200, quantity: 10, date: "2024-12-23" },
  { id: 2, item: "Shirt", category: "Clothing", price: 25, quantity: 50, date: "2024-12-24" },
  { id: 3, item: "Book", category: "Stationery", price: 15, quantity: 100, date: "2024-12-25" },
];

const Sales = () => {
  const [view, setView] = useState<"table" | "addSale" | "creditSale">("table");

  // Handler for view switching
  const handleViewChange = (newView: "table" | "addSale" | "creditSale") => {
    setView((currentView) => (currentView === newView ? "table" : newView));
  };

  return (
    <div className="vn-mt-5 vn-p-5">
      <h1 className="vn-text-2xl vn-font-bold vn-mb-5">Sales</h1>
      {/* <TopNavbar /> */}

      {/* Quick Actions */}
      <div className="vn-flex vn-justify-around vn-my-5">
        <button
          className={`vn-px-4 vn-py-2 vn-rounded vn-bg-gray-200 ${
            view === "table" ? "vn-bg-blue-400 vn-text-white" : "hover:vn-bg-gray-300"
          }`}
          onClick={() => handleViewChange("table")}
        >
          View Sales
        </button>
        <button
          className={`vn-px-4 vn-py-2 vn-rounded vn-bg-gray-200 ${
            view === "addSale" ? "vn-bg-blue-400 vn-text-white" : "hover:vn-bg-gray-300"
          }`}
          onClick={() => handleViewChange("addSale")}
        >
          Add Sale
        </button>
        <button
          className={`vn-px-4 vn-py-2 vn-rounded vn-bg-gray-200 ${
            view === "creditSale" ? "vn-bg-blue-400 vn-text-white" : "hover:vn-bg-gray-300"
          }`}
          onClick={() => handleViewChange("creditSale")}
        >
          Credit Sale
        </button>
      </div>

      {/* Conditional Rendering */}
      <div className="vn-mt-5">
        {/* {view === "table" && <DynamicTable headers={headers} data={data} />} */}
        {view === "addSale" && <AddSaleComponent />}
        {view === "creditSale" && <CreditSaleComponent />}
      </div>
    </div>
  );
};

export default Sales;

import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddPurchase from "../components/AddPurchase";

const headers = ["ID", "Item", "Category", "Price", "Quantity"];
const data = [
  { id: 1, item: "Laptop", category: "Electronics", price: 1200, quantity: 10 },
  { id: 2, item: "Shirt", category: "Clothing", price: 25, quantity: 50 },
  { id: 3, item: "Book", category: "Stationery", price: 15, quantity: 100 },
  // More rows can go here
];

const Purchases = () => {
  const [item, addItem] = useState(false);

  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-mt-5">
      <h1>Purchases</h1>
      {!item ? <TopNavbar /> : ""}

      {!item ? (
        <div className="vn-flex vn-justify-around">
          <button> Filter</button>
          <button onClick={() => addItem(!item)}>Make Purchase</button>
        </div>
      ) : ""}
      {/* Purchases Section */}

      {item ? <AddPurchase /> : <DynamicTable headers={headers} data={data} />}
    </div>
  );
};

export default Purchases;

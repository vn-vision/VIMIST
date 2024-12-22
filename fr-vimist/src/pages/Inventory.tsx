import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";

const headers = ["ID", "Item", "Category", "Price", "Quantity"];
const data = [
  { id: 1, item: "Laptop", category: "Electronics", price: 1200, quantity: 10 },
  { id: 2, item: "Shirt", category: "Clothing", price: 25, quantity: 50 },
  { id: 3, item: "Book", category: "Stationery", price: 15, quantity: 100 },
  // More rows can go here
];

const Inventory = () => {
  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-mt-5">
      <h1>Inventory</h1>
      <TopNavbar />
      <div className="vn-flex vn-justify-between">
        <button> Filter</button>
        <button>Add Item</button>
      </div>
      {/* inventory Section */}
      <DynamicTable headers={headers} data={data} />
    </div>
  );
};

export default Inventory;

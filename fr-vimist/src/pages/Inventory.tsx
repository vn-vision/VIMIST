import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddInventory from "../components/AddInventory";
import {
  useDisplayProducts,
  useDeleteProduct,
} from "../features/products/inventoryHook";
import { FaBoxOpen, FaPlus } from "react-icons/fa";

const headers = [
  "ID",
  "Category",
  "Name",
  "unit_price",
  "quantity_in_stock",
  "reorder_level",
];

const Inventory = () => {
  const [item, addItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);

  // get all products
  const allProducts = useDisplayProducts();

  // search Items by their ID, Name or Category
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
    if (allProducts.data) {
      const results = allProducts.data.filter(
        (product: any) =>
          product.id.toString().includes(query.toString()) ||
          product.category
            .toLowerCase()
            .includes(query.toString().toLowerCase()) ||
          product.name.toLowerCase().includes(query.toString().toLowerCase())
      );
      setFilteredData(results);
    }
  };

  // edit a product
  const handleEdit = (id: number) => {
    setEditItemId(id);
    addItem(true);
  };
  // delete a product by its ID
  const {
    deleteProduct,
    status: deleteStatus,
    error: deleteError,
  } = useDeleteProduct();
  deleteError && console.log("Error:", deleteError);

  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-p-5">
      <h1 className="vn-text-2xl vn-font-bold">Inventory</h1>

      {!item ? (
        <div
          className="vn-flex vn-justify-around"
          onClick={() => addItem(!item)}
        >
          <button className="vn-flex vn-gap-3 vn-items-center vn-border vn-text-primary hover:vn-text-secondary vn-px-3 vn-py-2 vn-rounded-lg">
            <div className="flex items-center gap-1">
              <FaPlus className="text-green-500" />
              <FaBoxOpen className="text-blue-500" />
            </div>
            Add Item
          </button>
        </div>
      ) : (
        ""
      )}

      {!item ? <TopNavbar onSearch={handleSearch} /> : ""}
      {/* inventory Section */}
      <h1> {deleteStatus === "failed" ? deleteError?.toString() : ""} </h1>
      {item ? (
        <AddInventory
          reset={() => {
            addItem(false);
            setEditItemId(null);
          }}
          itemId={editItemId}
        />
      ) : (
        <DynamicTable
          headers={headers}
          data={searchQuery ? filteredData : allProducts.data}
          onDelete={deleteProduct}
          onEdit={handleEdit}
        />
      )}

      {/* No results found */}
      {searchQuery && filteredData.length === 0 && (
        <p className="vn-text-center vn-text-gray-500">
          No items found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default Inventory;

import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddInventory from "../components/AddInventory";
import { useDisplayProducts, useDeleteProduct} from "../features/products/inventoryHook";

const headers = ["ID", "Category", "Name", "unit_price", "quantity_in_stock", "reorder_level"];

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
    if (allProducts.data){
      const results = allProducts.data.filter((product: any)=>
        product.id.toString().includes(query.toString()) ||
      product.category.toLowerCase().includes(query.toString().toLowerCase()) ||
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
    const {deleteProduct} = useDeleteProduct();

  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-mt-5">
      <h1>Inventory</h1>
      {!item ? <TopNavbar onSearch={handleSearch}/> : ""}

      {!item ? (
        <div className="vn-flex vn-justify-around">
          <button> Filter</button>
          <button onClick={() => addItem(!item)}>Add Item</button>
        </div>
      ) : ""}
      {/* inventory Section */}
      {item ? <AddInventory reset={() => {addItem(false); setEditItemId(null);}} itemId={editItemId}/> : <DynamicTable headers={headers} data={searchQuery ? filteredData : allProducts.data} onDelete={deleteProduct} onEdit={handleEdit}/>}

      {/* No results found */}
      {searchQuery && filteredData.length === 0 && (
        <p className="vn-text-center vn-text-gray-500">No items found matching "{searchQuery}"</p>     
      )}

    </div>
  );
};

export default Inventory;

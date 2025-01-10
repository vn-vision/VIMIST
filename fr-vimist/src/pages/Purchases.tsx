import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddPurchase from "../components/AddPurchase";
import {useDisplayPurchases, useDeletePurchases} from "../features/purchases/purchaseHook";
import { useNavigate } from "react-router-dom";

const headers = ["ID", "Product", "Quantity_Purchased", "Purchase_Price", "Supplier", "Purchase_Date"];


const Purchases = () => {
  const [item, addItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [editItemId, setEditItemId] = useState<number>(0);

  // fetch purchase data from hook
  const { data, status, error} = useDisplayPurchases();


  // delete data from hook
  const { deletePurchase } = useDeletePurchases();


  // search for purchase by ID, Name, Category or Supplier
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
    if (data){
      const results = data.filter((purchase: any) =>
        purchase.id.toString().includes(query.toString()) ||
      purchase.product.toString().includes(query.toString()) ||
      purchase.supplier?.toLowerCase().includes(query.toString().toLowerCase())
      );
      setFilteredData(results);
    }
  };

  // edit a purchase
  const handleEdit = (id: number) => {
    // check if the product exists
    const setProductId = data.find((purchase: any)=> purchase.id === id)?.product;
    setEditItemId(setProductId ?? 0); // set the product id to null if it does not exist
    addItem(true);
  };

  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-mt-5">
      <h1>Purchases</h1>
      {!item ? <TopNavbar onSearch={handleSearch} /> : ""}

      {!item ? (
        <div className="vn-flex vn-justify-around">
          <button> Filter</button>
          <button onClick={() => addItem(!item)}>Make Purchase</button>
        </div>
      ) : ""}
      {/* Purchases Section */}
      {status === 'loading' && <h2 className="vn-text-orange-500"> Loading...</h2>}
      {status === 'failed' && <h2 className="vn-text-red-500"> Error: {error}</h2>}
      {item ? <AddPurchase reset={() =>{addItem(false); setEditItemId(0);}} itemId={editItemId} /> :
            <DynamicTable
            headers={headers}
            data={Array.isArray(filteredData) && searchQuery && filteredData.length > 0 
              ? filteredData 
              : Array.isArray(data) && status === 'succeeded'
              ? data 
              : []}
            onEdit={handleEdit}
            onDelete={deletePurchase}
          />
          }
    </div>
  );
};

export default Purchases;

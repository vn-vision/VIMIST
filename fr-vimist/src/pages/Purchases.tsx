import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import AddPurchase from "../components/AddPurchase";
import {
  useDisplayPurchases,
  useDeletePurchases,
  useClearMessages
} from "../features/purchases/purchaseHook";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import AlertMessage from "../components/AlertMessage";

const headers = [
  "ID",
  "Product",
  "Quantity_Purchased",
  "Purchase_Price",
  "Supplier",
  "Purchase_Date",
];

const Purchases = () => {
  const [item, addItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | number>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [editItemId, setEditItemId] = useState<number>(0);

  const navigate = useNavigate();
  // fetch purchase data from hook
  const { data, status } = useDisplayPurchases();
  const { clsMessages } = useClearMessages();
  // delete data from hook
  const {
    deletePurchase,
    message: deleteMessage,
    error: deleteError,
  } = useDeletePurchases();

  // search for purchase by ID, Name, Category or Supplier
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
    if (data) {
      const results = data.filter(
        (purchase: any) =>
          purchase.id.toString().includes(query.toString()) ||
          purchase.product.toString().includes(query.toString()) ||
          purchase.supplier
            ?.toLowerCase()
            .includes(query.toString().toLowerCase())
      );
      setFilteredData(results);
    }
  };

  // edit a purchase
  const handleEdit = (id: number) => {
    // check if the product exists
    const setProductId = data.find(
      (purchase: any) => purchase.id === id
    )?.product;
    setEditItemId(setProductId ?? 0); // set the product id to null if it does not exist
    addItem(true);
  };

  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-p-5">
      <h1 className="vn-text-2xl vn-font-bold">Purchases</h1>
      {deleteError && <AlertMessage message={deleteError} type="error" onClose={clsMessages}/>}
      {deleteMessage && <AlertMessage message={deleteMessage} type="success" onClose={clsMessages}/>}
      {!item ? (
        <div className="vn-flex vn-justify-around">
          <button
            onClick={() => addItem(!item)}
            className="vn-flex vn-gap-3 vn-items-center vn-border vn-text-primary hover:vn-text-secondary vn-rounded-lg vn-px-3 vn-py-2"
          >
            <FaShoppingCart className="text-green-500" />
            Make Purchase
          </button>
        </div>
      ) : (
        ""
      )}

      {!item ? <TopNavbar onSearch={handleSearch} /> : ""}

      {/* Purchases Section */}
      {item ? (
        <AddPurchase
          reset={() => {
            addItem(false);
            setEditItemId(0);
          }}
          itemId={editItemId}
        />
      ) : (
        <DynamicTable
          headers={headers}
          data={
            Array.isArray(filteredData) &&
            searchQuery &&
            filteredData.length > 0
              ? filteredData
              : Array.isArray(data) && status === "succeeded"
              ? data
              : []
          }
          onEdit={handleEdit}
          onDelete={deletePurchase}
        />
      )}
    </div>
  );
};

export default Purchases;

import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
// import TopNavbar from "../components/TopNavbar";
import AddPurchase from "../components/AddPurchase";
import {useDisplayPurchases, useDeletePurchases} from "../features/purchases/purchaseHook";

const headers = ["ID", "Product", "Quantity_Purchased", "Purchase_Price", "Supplier", "Purchase_Date"];


const Purchases = () => {
  const [item, addItem] = useState(false);
  // fetch data from hook
  const { data } = useDisplayPurchases();

  // delete data from hook
  const { deletePurchase } = useDeletePurchases();

  // edit a purchase
  const handleEditPurchase = (purchase: any) => {
    console.log(purchase);
  };


  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-mt-5">
      <h1>Purchases</h1>
      {/* {!item ? <TopNavbar /> : ""} */}

      {!item ? (
        <div className="vn-flex vn-justify-around">
          <button> Filter</button>
          <button onClick={() => addItem(!item)}>Make Purchase</button>
        </div>
      ) : ""}
      {/* Purchases Section */}

      {item ? <AddPurchase /> : <DynamicTable headers={headers} data={data} onEdit={handleEditPurchase} onDelete={deletePurchase} />}
    </div>
  );
};

export default Purchases;

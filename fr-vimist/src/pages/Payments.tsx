import { useState } from "react";
import DynamicTable from "../components/DynamicTable";
import TopNavbar from "../components/TopNavbar";
import { useDisplayPayments, useDeletePayment, useClearMessages } from "../features/payments/paymentsHook";
import AlertMessage from "../components/AlertMessage";

// Payment headers
const headers =["Id", "Payment_For", "payment_method", "Payment_method", "Amount_Paid", "related"]


const Payments = () => {

  // create states for different actions in payment
  const [searchQuery, setSearchQuery] = useState<string | number | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(0);

  // set data state to payment data
  const { data: paymentData } = useDisplayPayments();
  
  // edit a payment
  const handleEdit = (id: number) => {
    setEditItemId(id);
    console.log(`Item to edit ${editItemId}`);
  }

  // delete a payment
  const { deletePayment, error: delErr, message: delMsg } = useDeletePayment();
  const { clsMessages } = useClearMessages();
  // search for sale by ID, payment date, payment_method, service paid for
  const handleSearch = (query: string | number) => {
    setSearchQuery(query);
    if (paymentData) {
      const results = paymentData?.filter(
        (payment: any) =>
          payment.id?.toString().includes(query.toString()) ||
          payment.payment_date?.toString().includes(query.toString()) ||
          payment.payment_method?.toLowerCase().includes(query.toString().toLowerCase()) ||
          payment.service?.toLowerCase().includes(query.toString().toLowerCase())
      );
      setFilteredData(results);
    }
  };
  
  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-p-5">
      {delErr && <AlertMessage message={delErr} type="error" onClose={clsMessages}/>}
      {delMsg && <AlertMessage message={delMsg} type="success" onClose={clsMessages}/>}
      <h1 className="vn-text-2xl vn-font-bold">Payments</h1>
      {/* top nav bar */}
      <TopNavbar onSearch={handleSearch}/>

      {/* Payments Section */}
      <DynamicTable
      headers={headers}
      data={
        Array.isArray(filteredData) && searchQuery && filteredData.length > 0 ?
        filteredData :
        Array.isArray(paymentData) ?
        paymentData :
        []
        }
        onEdit={handleEdit}
        onDelete={deletePayment}
        />
    </div>
  );
};

export default Payments;

import { useState } from 'react';
import DynamicTable from '../components/DynamicTable';
import { useDisplayCreditSales, useDeleteCreditSale, useClearMessages } from '../features/creditsales/creditHook';
import AlertMessage from './AlertMessage';


// set headers
const headers = [
  'id',
  'customer',
  'sale',
  'total_credit',
  'outstanding_balance',
  'due_date',
];

function CreditSaleComponent() {
  // set state for different actions in credit sale
  const [editItemId, setEditItemId] = useState<number | null>(0);
  
  // get data to display
  const { data: creditSalesData, message: displayMsg, error: displayErr } = useDisplayCreditSales();
  // delete a credit Sale
  const { deleteCreditSale, message:deleteMsg, error:deleteErr } = useDeleteCreditSale();
  const { clsMessages } = useClearMessages();

  // handle edit
  const handleEdit = (id: number) => {
    alert(`Edit item with id: ${editItemId}`);
    setEditItemId(id);
  }

  return (
    <div>
      {displayErr && <AlertMessage message={displayErr} type="error" onClose={clsMessages}/>}
      {displayMsg && <AlertMessage message={displayMsg} type="success" onClose={clsMessages}/>}

      {deleteErr && <AlertMessage message={deleteErr} type="error" onClose={clsMessages}/>}
      {deleteMsg && <AlertMessage message={deleteMsg} type="success" onClose={clsMessages}/>}
      
      <DynamicTable
      headers={headers}
      data={ Array.isArray(creditSalesData) && creditSalesData.length > 0 ? creditSalesData : []}
      onEdit={handleEdit}
      onDelete={deleteCreditSale}
      />

    </div>
  )
}

export default CreditSaleComponent

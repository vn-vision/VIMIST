import { useState } from 'react';
import DynamicTable from '../components/DynamicTable';
import { useDisplayCreditSales, useDeleteCreditSale } from '../features/creditsales/creditHook';


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
  const { data: creditSalesData } = useDisplayCreditSales();
  console.log("Credit ", creditSalesData);
  // delete a credit Sale
  const { deleteCreditSale } = useDeleteCreditSale();

  // handle edit
  const handleEdit = (id: number) => {
    setEditItemId(id);
    console.log(`Editing credit sale ${editItemId}`);
  }

  return (
    <div>
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

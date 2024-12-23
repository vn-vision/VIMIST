import DynamicTable from '../components/DynamicTable';

const headers = ['ID', 'ITEM', 'CATEGORY', 'PRICE', 'QUANTITY', 'DATE', 'CUSTOMER', 'THRESHHOLD'];
const data = [
  { id: 1, item: "Laptop", category: "Electronics", price: 1200, quantity: 10, date: '2024-12-23', customer: 123, threshhold: 250},
  { id: 2, item: "Shirt", category: "Clothing", price: 25, quantity: 50, date: '2024-12-24', customer: 143, threshhold: 450 },
  { id: 3, item: "Book", category: "Stationery", price: 15, quantity: 100, date: '2024-12-25', customer: 23, threshhold: 1250 },
];

function CreditSaleComponent() {
  return (
    <div>
      <DynamicTable headers={headers} data={data} />
    </div>
  )
}

export default CreditSaleComponent

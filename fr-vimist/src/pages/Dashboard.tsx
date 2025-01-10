import { useDisplayProducts } from "../features/products/inventoryHook";
// import TopNavbar from "../components/TopNavbar";
import DynamicGraph from "../components/Graphs";
import { useFetchSalesByPeriod } from "../features/sales/salesHook";
import { useFetchPurchasesByPeriod } from "../features/purchases/purchaseHook";

const Dashboard = () => {
 
  const AllProducts = useDisplayProducts();
  const {data: periodSalesData, status: periodSalesStatus, error: periodSalesError} = useFetchSalesByPeriod();
  const {data: periodPurchaseData, status: periodPurchaseStatu, error: periodPurchaseError} = useFetchPurchasesByPeriod();

    return (
        <div className="vn-flex vn-flex-col vn-h-full vn-gap-5 vn-mt-5">
          <h1>Dashboard</h1>
          {/* Top Navbar */}
          {/* <TopNavbar /> */}
  
          {/* Responsive Grid */}
          <div className="vn-grid vn-grid-cols-1 md:vn-grid-cols-2 vn-grid-rows-4 md:vn-grid-rows-2 vn-flex-grow">
            {/* Sales Section */}
            <div className="vn-bg-blue-100 vn-flex vn-flex-col vn-justify-center vn-items-center vn-p-4 vn-overflow-hidden">
              <h2 className="vn-text-lg vn-font-semibold vn-mb-2">Sales</h2>
              <div className="vn-h-full vn-w-full">
                <DynamicGraph data={periodSalesData} dataFor='Sales' status={periodSalesStatus} error={periodSalesError} />
              </div>
            </div>
  
            {/* Purchases Section */}
            <div className="vn-bg-green-100 vn-flex vn-flex-col vn-justify-center vn-items-center vn-p-4 vn-overflow-hidden">
              <h2 className="vn-text-lg vn-font-semibold vn-mb-2">Purchases</h2>
              <div className="vn-h-full vn-w-full">
                <DynamicGraph data={periodPurchaseData} dataFor="Purchases" status={periodPurchaseStatu} error={periodPurchaseError}/>
              </div>
            </div>
  
            {/* Stock Section */}
            <div className="vn-bg-yellow-100 vn-flex vn-flex-col vn-justify-center vn-items-center vn-p-4 vn-overflow-hidden">
              <h2 className="vn-text-lg vn-font-semibold vn-mb-2">Stock</h2>
              <div className="vn-h-full vn-w-full">
                {/* <DynamicGraph /> */}
              </div>
            </div>
  
            {/* Stock Level Section */}
            <div className="vn-bg-red-100 vn-flex vn-flex-col vn-justify-center vn-items-center vn-p-4 vn-overflow-auto">
              <h2 className="vn-text-lg vn-font-semibold vn-mb-2">Stock Level</h2>
              <ul className="vn-list-disc vn-list-inside vn-text-sm vn-text-gray-800">
                {AllProducts.data.map((product) => (
                  <li key={product.id}>
                    <span className="vn-font-medium">{product.name}</span>:{" "}
                    {product.quantity_in_stock} units
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2> stock levels by period</h2>

            </div>
          </div>
        </div>
    );  
};

export default Dashboard;

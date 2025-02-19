import { useDisplayProducts } from "../features/products/inventoryHook";
import DynamicGraph from "../components/Graphs";
import {
  useFetchSalesByPeriod,
  useClearMessages as ClearSalesPeriod,
} from "../features/sales/salesHook";
import {
  useFetchPurchasesByPeriod,
  useClearMessages as ClearPurchasesPeriod,
} from "../features/purchases/purchaseHook";
import AlertMessage from "../components/AlertMessage";

const Dashboard = () => {
  const AllProducts = useDisplayProducts();
  const {
    data: periodSalesData,
    message: periodMsgS,
    error: periodErrS,
    status: periodSalesStatus,
  } = useFetchSalesByPeriod();
  const {
    data: periodPurchaseData,
    message: periodMsgP,
    error: periodErrP,
    status: periodPurchaseStatus,
  } = useFetchPurchasesByPeriod();

  const {clsMessages: clsMsgP} = ClearPurchasesPeriod();
  const {clsMessages: clsMsgS} = ClearSalesPeriod();
  return (
    <div className="vn-flex vn-flex-col vn-h-full vn-gap-6 vn-p-6 vn-bg-gray-50">
      <h1 className="vn-text-3xl vn-font-bold vn-text-gray-900">Dashboard</h1>

      {/* Responsive Grid Layout */}
      <div className="vn-grid vn-grid-cols-1 md:vn-grid-cols-2 lg:vn-grid-cols-3 vn-gap-6">
        {/* Sales Section */}
        <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-5 vn-flex vn-flex-col vn-justify-center vn-items-center vn-border vn-border-blue-300">
          {periodMsgP && (
            <AlertMessage
              message={periodMsgP}
              type="success"
              onClose={clsMsgP}
            />
          )}
          {periodErrP && (
            <AlertMessage
              message={periodErrP}
              type="error"
              onClose={clsMsgP}
            />
          )}
          {periodMsgS && (
            <AlertMessage
              message={periodMsgS}
              type="success"
              onClose={clsMsgS}
            />
          )}
          {periodErrS && (
            <AlertMessage
              message={periodErrS}
              type="error"
              onClose={clsMsgS}
            />
          )}
          <h2 className="vn-text-xl vn-font-semibold vn-text-blue-700">
            Sales
          </h2>
          <div className="vn-h-60 vn-w-full">
            {periodErrS ?
            (<h1>Could not load Purchases... Try reloading Page</h1>
            ) : (
            <DynamicGraph
              data={periodSalesData}
              dataFor="Sales"
              status={periodSalesStatus}
              error={periodErrS}
            />
            )}
          </div>
        </div>

        {/* Purchases Section */}
        <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-5 vn-flex vn-flex-col vn-justify-center vn-items-center vn-border vn-border-green-300">
          {periodMsgP && (
            <AlertMessage
              message={periodMsgP}
              type="success"
              onClose={clsMsgP}
            />
          )}
          {periodErrP && (
            <AlertMessage
              message={periodErrP}
              type="error"
              onClose={clsMsgP}
            />
          )}
          {periodMsgS && (
            <AlertMessage
              message={periodMsgS}
              type="success"
              onClose={clsMsgS}
            />
          )}
          {periodErrS && (
            <AlertMessage
              message={periodErrS}
              type="error"
              onClose={clsMsgS}
            />
          )}
          <h2 className="vn-text-xl vn-font-semibold vn-text-green-700">
            Purchases
          </h2>
          <div className="vn-h-60 vn-w-full">
            {periodErrP ?
            (<h1>Could not load Purchases... Try reloading Page</h1>
            ) : (
            <DynamicGraph
              data={periodPurchaseData}
              dataFor="Purchases"
              status={periodPurchaseStatus}
              error={periodErrP}
            />
            )}
          </div>
        </div>

        {/* Stock Section */}
        <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-5 vn-flex vn-flex-col vn-justify-center vn-items-center vn-border vn-border-yellow-300">
          <h2 className="vn-text-xl vn-font-semibold vn-text-yellow-700">
            Stock
          </h2>
          <div className="vn-h-60 vn-w-full">
            {/* Placeholder for stock graph */}
            <p className="vn-text-gray-500">
              Stock data visualization coming soon...
            </p>
          </div>
        </div>

        {/* Stock Level Section */}
        <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-5 vn-flex vn-flex-col vn-justify-start vn-items-center vn-border vn-border-red-300">
          <h2 className="vn-text-xl vn-font-semibold vn-text-red-700">
            Stock Level
          </h2>
          <div className="vn-h-40 vn-overflow-y-auto vn-w-full">
            <ul className="vn-list-disc vn-list-inside vn-text-gray-800 vn-text-sm">
              {AllProducts?.data?.length > 0 ? (
                AllProducts.data.map((product) => (
                  <li
                    key={product.id}
                    className="vn-border-b vn-py-2 vn-text-gray-700"
                  >
                    <span className="vn-font-medium">{product.name}</span>:{" "}
                    {product.quantity_in_stock} units
                  </li>
                ))
              ) : (
                <p className="vn-text-gray-500">No products available</p>
              )}
            </ul>
          </div>
        </div>

        {/* Stock Levels by Period */}
        <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-5 vn-flex vn-flex-col vn-justify-center vn-items-center vn-border vn-border-purple-300">
          <h2 className="vn-text-xl vn-font-semibold vn-mb-3 vn-text-purple-700">
            Stock Levels by Period
          </h2>
          <p className="vn-text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

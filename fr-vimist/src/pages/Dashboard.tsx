import React, { useState } from "react";
import {
  useDisplayProducts,
  useDisplayProductId,
  useAddNewProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../features/products/inventoryHook";
import { Product } from "../api/inventoryAPI";
import TopNavbar from "../components/TopNavbar";
import DynamicGraph from "../components/Graphs";
import { dataSets } from "../assets/data/datasets";

const Dashboard = () => {
  const [updateProductData, setUpdateProductData] = useState<Product>({
    id: 0,
    name: "",
    category: "",
    unit_price: 0,
    quantity_in_stock: 0,
    reorder_level: 0,
  });

  const AllProducts = useDisplayProducts();
  
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
                <DynamicGraph dataSets={dataSets} />
              </div>
            </div>
  
            {/* Purchases Section */}
            <div className="vn-bg-green-100 vn-flex vn-flex-col vn-justify-center vn-items-center vn-p-4 vn-overflow-hidden">
              <h2 className="vn-text-lg vn-font-semibold vn-mb-2">Purchases</h2>
              <div className="vn-h-full vn-w-full">
                <DynamicGraph dataSets={dataSets} />
              </div>
            </div>
  
            {/* Stock Section */}
            <div className="vn-bg-yellow-100 vn-flex vn-flex-col vn-justify-center vn-items-center vn-p-4 vn-overflow-hidden">
              <h2 className="vn-text-lg vn-font-semibold vn-mb-2">Stock</h2>
              <div className="vn-h-full vn-w-full">
                <DynamicGraph dataSets={dataSets} />
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
          </div>
        </div>
    );  
};

export default Dashboard;

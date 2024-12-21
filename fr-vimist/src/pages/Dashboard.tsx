import React, { useState } from "react";
import {
  useDisplayProducts,
  useDisplayProductId,
  useAddNewProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../features/products/inventoryHook";
import { Product } from "../api/inventoryAPI";
import SideNavbar from "../components/SideNavbar";

const Dashboard = () => {
  const [selectId, setId] = useState<number | null>(0);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    category: "",
    unit_price: 0,
    quantity_in_stock: 0,
    reorder_level: 0,
  });

  const [updateProductData, setUpdateProductData] = useState<Product>({
    id: 0,
    name: "",
    category: "",
    unit_price: 0,
    quantity_in_stock: 0,
    reorder_level: 0,
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const AllProducts = useDisplayProducts();
  const OneProduct = useDisplayProductId(selectId || 0);
  const { addProduct } = useAddNewProduct();
  const { updateProduct } = useUpdateProduct();
  const { deleteProduct } = useDeleteProduct();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setNewProduct({
      id: 0,
      name: "",
      category: "",
      unit_price: 0,
      quantity_in_stock: 0,
      reorder_level: 0,
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProductData.id) {
      updateProduct(updateProductData);
      setUpdateProductData({
        id: 0,
        name: "",
        category: "",
        unit_price: 0,
        quantity_in_stock: 0,
        reorder_level: 0,
      });
    }
  };

  const handleDeleteProduct = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setDeleteId(null);
    }
  };



  return (
    <div>
      <SideNavbar />
      <h1 className="vn-text-cyan-600">Products</h1>
      <ul>
        {AllProducts.data.map((product: Product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: {product.unit_price}</p>
            <p>Stock: {product.quantity_in_stock}</p>
            <p>Reorder Level: {product.reorder_level}</p>
          </li>
        ))}
      </ul>
      <br/>
      <br/>
      <h1 className="vn-text-yellow-700">Single Product</h1>

        <input
          type="number"
          placeholder="Enter Product ID"
          value={selectId || ""}
          onChange={(e) => setId(parseInt(e.target.value))}
        />

      {OneProduct.data &&
        OneProduct.data.map((product: Product) =>
          product.id === selectId ? (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: {product.unit_price}</p>
              <p>Stock: {product.quantity_in_stock}</p>
              <p>Reorder Level: {product.reorder_level}</p>
            </div>
          ) : null
        )}
      <br/>
      <br/>
      <h1 className="vn-text-green-500">Add Product</h1>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Unit Price"
          value={newProduct.unit_price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              unit_price: parseFloat(e.target.value),
            })
          }
        />
        <input
          type="number"
          placeholder="Quantity in Stock"
          value={newProduct.quantity_in_stock}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              quantity_in_stock: parseInt(e.target.value),
            })
          }
        />
        <input
          type="number"
          placeholder="Reorder Level"
          value={newProduct.reorder_level}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              reorder_level: parseInt(e.target.value),
            })
          }
        />
        <button type="submit">Add Product</button>
      </form>
      <br/>
      <br/>

      <h1 className="vn-text-orange-400">Update Product</h1>
      <form onSubmit={handleUpdateProduct}>
        <input
          type="number"
          placeholder="Enter Product ID"
          value={updateProductData.id || ""}
          onChange={(e) =>
            setUpdateProductData({
              ...updateProductData,
              id: parseInt(e.target.value),
            })
          }
        />
        <input
          type="text"
          placeholder="Name"
          value={updateProductData.name}
          onChange={(e) =>
            setUpdateProductData({ ...updateProductData, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Category"
          value={updateProductData.category}
          onChange={(e) =>
            setUpdateProductData({
              ...updateProductData,
              category: e.target.value,
            })
          }
        />
        <input
          type="number"
          placeholder="Unit Price"
          value={updateProductData.unit_price}
          onChange={(e) =>
            setUpdateProductData({
              ...updateProductData,
              unit_price: parseFloat(e.target.value),
            })
          }
        />
        <input
          type="number"
          placeholder="Quantity in Stock"
          value={updateProductData.quantity_in_stock}
          onChange={(e) =>
            setUpdateProductData({
              ...updateProductData,
              quantity_in_stock: parseInt(e.target.value),
            })
          }
        />
        <input
          type="number"
          placeholder="Reorder Level"
          value={updateProductData.reorder_level}
          onChange={(e) =>
            setUpdateProductData({
              ...updateProductData,
              reorder_level: parseInt(e.target.value),
            })
          }
        />
        <button type="submit">Update Product</button>
      </form>
      <br/>
      <br/>
      <h1 className="vn-text-red-700">Delete Product</h1>
      <input
        type="number"
        placeholder="Enter Product ID"
        value={deleteId || ""}
        onChange={(e) => setDeleteId(parseInt(e.target.value))}
      />
      <button type="button" onClick={handleDeleteProduct}>
        Delete Product
      </button>
    </div>
  );
};

export default Dashboard;

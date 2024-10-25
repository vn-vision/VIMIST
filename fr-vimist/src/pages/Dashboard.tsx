import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from '../features/products/inventorySlice';
import { AppDispatch, RootState } from '../store/store';
import { Product } from '../api/inventoryAPI';

const Dashboard = () => {

    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state:RootState)=>state.inventory.products || []);
    const status = useSelector((state: RootState) => state.inventory.status);
    const error = useSelector((state: RootState) => state.inventory.error);
  
    useEffect(() => {
      dispatch(loadProducts());  // Dispatch loadProducts when component mounts
    }, [dispatch]);
  
          console.log("Products ", products)
    return (
      <div>
        <h2>Testing Products Data</h2>
        {status === 'loading' && <p>Loading products...</p>}
        {status === 'failed' && <p>Error loading products: {error}</p>}
        {status === 'succeeded' && (
                <ul>
                {products.map((product: Product) => (
                    <li key={product.id}>
                        {product.name} - {product.category} USD
                    </li>
                ))}
            </ul>
            
            )}
      </div>
    );
  };

export default Dashboard

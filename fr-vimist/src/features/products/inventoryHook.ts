import {
  loadProducts,
  fetchProductById,
  addNewProduct,
  modifyProduct,
  removeProduct,
  clearMessages,
} from "./inventorySlice";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Product } from "../../utils/api/inventoryAPI";

// Hook to display products
export const useDisplayProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.inventory.products || []);
  const status = useSelector((state: RootState) => state.inventory.status);
  const error = useSelector((state: RootState) => state.inventory.error);
  const message = useSelector((state: RootState) => state.inventory.message);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(loadProducts());
    }
  }, [dispatch, products.length]);

  return { data: products, status, error, message };
};

// Hook to get a specific product by ID
export const useDisplayProductId = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const product = useSelector((state: RootState) => state.inventory.products || []);
  const status = useSelector((state: RootState) => state.inventory.status);
  const error = useSelector((state: RootState) => state.inventory.error);

  useEffect(() => {
    if (product === null) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, product]);

  return {data: product, status, error };
};

// Hook to add a new product
export const useAddNewProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.inventory.status);
  const error = useSelector((state: RootState) => state.inventory.error);
  const message = useSelector((state: RootState) => state.inventory.message);

  const addProduct = (product: FormData) => {
    dispatch(addNewProduct(product));
  };

  return { addProduct, status, error, message };
};

// Hook to update a product
export const useUpdateProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.inventory.status);
  const error = useSelector((state: RootState) => state.inventory.error);
  const message = useSelector((state: RootState) => state.inventory.message);

  const updateProduct = (product: Product) => {
    dispatch(modifyProduct(product));
  };

  return { updateProduct, status, error, message };
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.inventory.status);
  const error = useSelector((state: RootState) => state.inventory.error);
  const message = useSelector((state: RootState) => state.inventory.message);

  const deleteProduct = (id: number) => {
    dispatch(removeProduct(id));
  };

  return { deleteProduct, status, error, message };
};

// create hook to clear messages
export const useClearMessages = () => {
  const dispatch = useDispatch<AppDispatch>();

  const clsMessages = () => {
      dispatch(clearMessages());
  }

  return {clsMessages};
};
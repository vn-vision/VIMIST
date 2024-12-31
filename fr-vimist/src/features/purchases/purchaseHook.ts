// custom hooks for purchases feature
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Purchase } from "../../api/purchasesAPI";
import { fetchPurchaseById, fetchPurchases, addNewPurchase, modifyPurchase, removePurchase } from "./purchasesSlice";

// Hook to display purchases
export const useDisplayPurchases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const purchases = useSelector((state: RootState) => state.purchases.purchases || []);
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);

  useEffect(() => {
    if (purchases.length === 0) {
      dispatch(fetchPurchases());
    }
  }, [dispatch, purchases.length]);

  return { data: purchases, status, error };
};

// Hook to get a specific purchase by ID
export const useDisplayPurchaseById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const purchase = useSelector((state: RootState) => state.purchases.purchases || []);
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);

  useEffect(() => {
    if (purchase === null) {
      dispatch(fetchPurchaseById(id));
    }
  }, [dispatch, id, purchase]);

  return { data: purchase, status, error };
};

// Hook to add a new purchase
export const useAddNewPurchase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);

  const addPurchase = (purchase: Purchase) => {
    dispatch(addNewPurchase(purchase));
  };

  return { addPurchase, status, error };
};

// Hook to update a purchase
export const useUpdatePurchase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);

  const updatePurchase = (purchase: Purchase) => {
    dispatch(modifyPurchase(purchase));
  };

  return { updatePurchase, status, error };
};

// Hook to delete a purchase
export const useDeletePurchases =()=>{
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.purchases.status);
    const error = useSelector((state: RootState) => state.purchases.error);

    const deletePurchase = (id: number) => {
        dispatch(removePurchase(id));
    };
    return {deletePurchase, status, error};
};
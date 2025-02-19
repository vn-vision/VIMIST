// custom hooks for purchases feature
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Purchase } from "../../utils/api/purchasesAPI";
import { fetchPurchaseById, fetchPurchases, addNewPurchase, modifyPurchase, removePurchase, fetchPeriodicPurchases, clearMessages } from "./purchasesSlice";

// Hook to display purchases
export const useDisplayPurchases = () => {
  const dispatch = useDispatch<AppDispatch>();
  const purchases = useSelector((state: RootState) => state.purchases.purchases || []);
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);
  const message = useSelector((state: RootState) => state.purchases.message);

  useEffect(() => {
    if (purchases.length === 0) {
      dispatch(fetchPurchases());
    }
  }, [dispatch, purchases.length]);

  return { data: purchases, status, error, message };
};

// Hook to get a specific purchase by ID
export const useDisplayPurchaseById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const purchase = useSelector((state: RootState) => state.purchases.purchases || []);
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);
  const message = useSelector((state: RootState) => state.purchases.message);

  useEffect(() => {
    if (purchase === null) {
      dispatch(fetchPurchaseById(id));
    }
  }, [dispatch, id, purchase]);

  return { data: purchase, status, error, message };
};

// Hook to add a new purchase
export const useAddNewPurchase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);
  const message = useSelector((state: RootState) => state.purchases.message);

  const addPurchase = (purchase: Purchase) => {
    dispatch(addNewPurchase(purchase));
  };

  return { addPurchase, status, error, message };
};

// Hook to update a purchase
export const useUpdatePurchase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);
  const message = useSelector((state: RootState) => state.purchases.message);

  const updatePurchase = (purchase: Purchase) => {
    dispatch(modifyPurchase(purchase));
  };

  return { updatePurchase, status, error, message };
};

// Hook to delete a purchase
export const useDeletePurchases = () =>{
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.purchases.status);
    const error = useSelector((state: RootState) => state.purchases.error);
    const message = useSelector((state: RootState) => state.purchases.message);

    const deletePurchase = (id: number) => {
        dispatch(removePurchase(id));
    };
    return {deletePurchase, status, error, message };
};

// hook to fetch purchases by period
export const useFetchPurchasesByPeriod = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.purchases.status);
  const error = useSelector((state: RootState) => state.purchases.error);
  const message = useSelector((state: RootState) => state.purchases.message);
  const purchases_by_period = useSelector((state: RootState) => state.purchases.period);

  useEffect(()=>{
    if (purchases_by_period.length === 0){
      dispatch(fetchPeriodicPurchases());
    }
  }, [dispatch, purchases_by_period]);
  return {status, error, data: purchases_by_period, message};
};

// hook to clear Messages
export const useClearMessages = () => {
  const dispatch = useDispatch<AppDispatch>();

  const clsMessages = () =>  {
    dispatch(clearMessages());
  }
  return {clsMessages};
};
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { CreditSale } from "../../utils/api/creditAPI";
import { fetchCreditSaleById, fetchCreditSales, addNewCreditSale, modifyCreditSale, removeCreditSale } from "./creditSlice";


// Hook to display credit sales
export const useDisplayCreditSales = () => {
  const dispatch = useDispatch<AppDispatch>();
  const creditSales = useSelector((state: RootState) => state.creditSales || []);
  const status = useSelector((state: RootState) => state.creditSales.status);
  const error = useSelector((state: RootState) => state.creditSales.error);

  useEffect(() => {
    if (!creditSales) {
      dispatch(fetchCreditSales());
    }
  }, [dispatch, creditSales]);

  return { data: creditSales, status, error };
};

// Hook to get a specific credit sale by ID
export const useDisplayCreditSaleById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const creditSale = useSelector((state: RootState) => state.creditSales || []);
  const status = useSelector((state: RootState) => state.creditSales.status);
  const error = useSelector((state: RootState) => state.creditSales.error);

  useEffect(() => {
    if (creditSale === null) {
      dispatch(fetchCreditSaleById(id));
    }
  }, [dispatch, id, creditSale]);

  return { data: creditSale, status, error };
};

// Hook to add a new credit sale
export const useAddNewCreditSale = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.creditSales.status);
  const error = useSelector((state: RootState) => state.creditSales.error);

  const addCreditSale = (creditSale: CreditSale) => {
    dispatch(addNewCreditSale(creditSale));
  };

  return { addCreditSale, status, error };
};

// Hook to update a credit sale
export const useUpdateCreditSale = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.creditSales.status);
  const error = useSelector((state: RootState) => state.creditSales.error);

  const updateCreditSale = (creditSale: CreditSale) => {
    dispatch(modifyCreditSale(creditSale));
  };

  return { updateCreditSale, status, error };
};

// Hook to delete a credit sale
export const useDeleteCreditSale = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.creditSales.status);
  const error = useSelector((state: RootState) => state.creditSales.error);

  const deleteCreditSale = (id: number) => {
    dispatch(removeCreditSale(id));
  };

  return { deleteCreditSale, status, error };
};
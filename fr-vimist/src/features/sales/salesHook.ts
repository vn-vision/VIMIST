import {
  fetchSaleById,
  fetchSales,
  addNewSale,
  modifySale,
  removeSale,
  fetchPeriodicSales,
} from "../sales/salesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Sale } from "../../utils/api/salesAPI";

// create hooks to get the data and status of a sale request
export const useFetchSaleById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const sales = useSelector((state: RootState) => state.sales.sales || null);
  const status = useSelector((state: RootState) => state.sales.status);
  const error = useSelector((state: RootState) => state.sales.error);

  useEffect(() => {
    if (sales === null) {
      dispatch(fetchSaleById(id));
    }
  }, [dispatch, id, sales]);

  return { data: sales, status, error };
};

// create hook to get all sales
export const useFetchSales = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sales = useSelector((state: RootState) => state.sales.sales);
  const status = useSelector((state: RootState) => state.sales.status);
  const error = useSelector((state: RootState) => state.sales.error);

  useEffect(() => {
    if (sales.length === 0) {
      dispatch(fetchSales());
    }
  }, [dispatch, sales.length]);
  return { data: sales, status, error };
};

// create a hook to get all sales by period
export const useFetchSalesByPeriod = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sales_by_period = useSelector((state: RootState) => state.sales.period);
  const status = useSelector((state: RootState) => state.sales.status);
  const error = useSelector((state: RootState) => state.sales.error);

  useEffect(()=>{
    if(sales_by_period.length === 0){
      dispatch(fetchPeriodicSales());
    }
  }, [dispatch, sales_by_period.length]);
  return {data: sales_by_period, status, error};
};

// create hook to add a new sale
export const useAddNewSale = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.sales.status);
  const error = useSelector((state: RootState) => state.sales.error);

  const addSale = (sale: Sale) => {dispatch(addNewSale(sale));};

  return {addSale, status, error}
};

// create hook to modify a sale
export const useUpdateSale = () =>{
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.sales.status);
    const error = useSelector((state: RootState) => state.sales.error);

    const updateSale = (sale: Sale) =>{
        dispatch(modifySale(sale));
    };

    return {updateSale, status, error}
};

// delete a sale
export const useDeleteSale = () =>{
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.sales.status);
    const error = useSelector((state: RootState) => state.sales.error);

    const deleteSale = (id: number) =>{
        dispatch(removeSale(id));
    };

    return {deleteSale, status, error}
};
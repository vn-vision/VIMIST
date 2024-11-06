import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Customer } from "../../api/customerAPI";
import { fetchCustomerById, fetchCustomers, addNewCustomer, modifyCustomer, removeCustomer } from "./customersSlice";

// Hook to display customers
export const useDisplayCustomers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state: RootState) => state.customers.customers || []);
  const status = useSelector((state: RootState) => state.customers.status);
  const error = useSelector((state: RootState) => state.customers.error);

  useEffect(() => {
    if (customers.length === 0) {
      dispatch(fetchCustomers());
    }
  }, [dispatch, customers.length]);

  return { data: customers, status, error };
};

// Hook to get a specific customer by ID
export const useDisplayCustomerId = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const customer = useSelector((state: RootState) => state.customers.customers || []);
  const status = useSelector((state: RootState) => state.customers.status);
  const error = useSelector((state: RootState) => state.customers.error);

  useEffect(() => {
    if (customer === null) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id, customer]);

  return {data: customer, status, error };
};

// Hook to add a new customer
export const useAddNewCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.customers.status);
  const error = useSelector((state: RootState) => state.customers.error);

  const addCustomer = (customer: Customer) => {
    dispatch(addNewCustomer(customer));
  };

  return { addCustomer, status, error };
};

// Hook to update a customer
export const useUpdateCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.customers.status);
  const error = useSelector((state: RootState) => state.customers.error);

  const updateCustomer = (customer: Customer) => {
    dispatch(modifyCustomer(customer));
  };

  return { updateCustomer, status, error };
};

// Hook to delete a customer
export const useDeleteCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.customers.status);
  const error = useSelector((state: RootState) => state.customers.error);

  const deleteCustomer = (id: number) => {
    dispatch(removeCustomer(id));
  };

  return { deleteCustomer, status, error };
};
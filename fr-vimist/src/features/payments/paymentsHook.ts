import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { Payment, MpesaPaymentRequest } from "../../utils/api/paymentsAPI";
import { fetchPaymentById, fetchPayments, addNewPayment, modifyPayment, removePayment, clearMessages, initiateMobilePayment } from "./paymentsSlice";

// Hook to display payments
export const useDisplayPayments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const payments = useSelector((state: RootState) => state.payments.Payments || []);
  const status = useSelector((state: RootState) => state.payments.status);
  const error = useSelector((state: RootState) => state.payments.error);
  const message = useSelector((state: RootState) => state.payments.message);


  useEffect(() => {
    if (payments.length === 0) {
      dispatch(fetchPayments());
    }
  }, [dispatch, payments.length]);

  return { data: payments, status, error, message };
};

// Hook to get a specific payment by ID
export const useDisplayPaymentById = (id: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const payment = useSelector((state: RootState) => state.payments.Payments || []);
  const status = useSelector((state: RootState) => state.payments.status);
  const error = useSelector((state: RootState) => state.payments.error);
  const message = useSelector((state: RootState) => state.payments.message);

  useEffect(() => {
    if (payment === null) {
      dispatch(fetchPaymentById(id));
    }
  }, [dispatch, id, payment]);

  return { data: payment, status, error, message };
};

// Hook to add a new payment
export const useAddNewPayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.payments.status);
  const error = useSelector((state: RootState) => state.payments.error);
  const message = useSelector((state: RootState) => state.payments.message);

  const addPayment = (payment: Payment) => {
    dispatch(addNewPayment(payment));
  };

  return { addPayment, status, error, message };
};

// Hook to update a payment
export const useUpdatePayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.payments.status);
  const error = useSelector((state: RootState) => state.payments.error);
  const message = useSelector((state: RootState) => state.payments.message);

  const updatePayment = (payment: Payment) => {
    dispatch(modifyPayment(payment));
  };

  return { updatePayment, status, error, message };
};

// Hook to delete a payment
export const useDeletePayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.payments.status);
  const error = useSelector((state: RootState) => state.payments.error);
  const message = useSelector((state: RootState) => state.payments.message);

  const deletePayment = (id: number) => {
    dispatch(removePayment(id));
  };

  return { deletePayment, status, error, message };
};

// Hook to initiate Mpesa Payment
export const useInitiateMpesaPayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.payments.status);
  const error = useSelector((state: RootState) => state.payments.error);
  const message = useSelector((state: RootState) => state.payments.message);

  const initiateMpesa = (payment: MpesaPaymentRequest) => {
    dispatch(initiateMobilePayment(payment));
  }

  return {initiateMpesa, status, error, message};
}

// Hook to clear messages
export const useClearMessages = () => {
  const dispatch = useDispatch<AppDispatch>();

  const clsMessages = () => {
    dispatch(clearMessages());
  };

  return { clsMessages };
};
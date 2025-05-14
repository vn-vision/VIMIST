import React, { useCallback, useState } from "react";
import { Product } from "../utils/api/inventoryAPI";
import logo from "../assets/images/logo.jpg";
import { useAddNewSale, useClearMessages } from "../features/sales/salesHook";
import { useDisplayCustomers } from "../features/customers/customerHook";
import AlertMessage from "./AlertMessage";
import { useInitiateMpesaPayment } from "../features/payments/paymentsHook";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartSummaryProps = {
  cart: CartItem[];
  onUpdateQuantity: (product: Product, quantity: number) => void;
  onRemoveFromCart: (product: Product) => void;
};

// get contact from session
const contact = sessionStorage.getItem("contact");

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  // fetch add sale function
  const { addSale, error: saleError, message: saleMessage} = useAddNewSale();
  const {clsMessages} = useClearMessages();
  const [phoneNumber, setPhoneNum] = useState('254');
  const [err, setError] = useState('');

  // filter customer by contact
  const { data: customerData } = useDisplayCustomers();

  // initiate 
  const {initiateMpesa, error: MpesaError, message: MpesaMsg} = useInitiateMpesaPayment();

  const customa = customerData
    ? customerData.filter(
        (cst: any) =>
          cst.contact_info?.includes(contact ? contact.toString() : "") // Convert contact to string
      )
    : [];

  const [logPayment, setLogPayment] = React.useState<string>("Cash");
  const handleIncrement = (product: Product) => {
    onUpdateQuantity(product, 1);
  };

  const handleDecrement = (product: Product) => {
    onUpdateQuantity(product, -1);
  };

  const calculateSubtotal = () => {
    return cart
      .reduce((acc, item) => acc + item.product.unit_price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTax = (subtotal: number) => {
    const taxRate = 0.16; // 16% VAT
    return (subtotal * taxRate).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax(subtotal));
    return (subtotal + tax).toFixed(0);
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');

    if (!input.startsWith('254')){
      input = '254';
    }

    if (input.length > 12){
      input = input.slice(0, 12);
    }
    setPhoneNum(input);

    // validation error message
    if (input.length < 12){
      setError('Phone must be 12 digits (254XXXXXXXXX)');
    } else {
      setError('');
    }
  }, []);

  console.log(calculateTotal())
  console.log(phoneNumber)
  const handleMpesaPayment = () => {
    const payment = {
      phone_number: phoneNumber,
      amount: calculateTotal(),
    };

    initiateMpesa(payment);
  }
  const handleRecordSale = (paymentType: string) => {
    if (paymentType === "Mpesa"){
      handleMpesaPayment();
    }
    cart
      .map((item, index) => ({
        id: index,
        product: item.product.id,
        quantity_sold: item.quantity,
        sale_price: item.product.unit_price,
        sale_date: new Date().toISOString().split("T")[0],
        customer:
          customa && customa.length > 0 ? customa[0].id.toString() : null,
        payment_type: paymentType,
      }))
      .forEach((sale) => addSale(sale));
  };

  return (
    <div className="vn-min-h-screen vn-text-secondary vn-p-4 vn-flex vn-flex-col vn-min-w-[40%]">
      {saleMessage && <AlertMessage message={saleMessage} type="success" onClose={clsMessages}/>}
      {saleError && <AlertMessage message={saleError} type="error" onClose={clsMessages}/>}
      {MpesaError && <AlertMessage message={MpesaError} type="error" onClose={clsMessages}/>}
      {MpesaMsg && <AlertMessage message={MpesaMsg} type="success" onClose={clsMessages}/>}
      
      <h2 className="vn-text-2xl vn-font-bold vn-mb-4">Cart Summary</h2>
      {cart.length > 0 && (
        <div>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.product.id}
                className="vn-flex vn-items-center vn-justify-between vn-py-2"
              >
                <div className="vn-flex vn-items-center">
                  <img
                    src={item.product?.image instanceof File ? 
                      URL.createObjectURL(item.product.image) : item.product.image || logo}
                    alt={item.product.name}
                    className="vn-w-16 vn-h-16 rounded vn-object-cover vn-mr-4"
                  />
                  <div>
                    <h3 className="vn-font-medium">{item.product.name}</h3>
                    <p className="vn-text-sm vn-text-gray-500">
                      {item.product.category}
                    </p>
                  </div>
                </div>

                <div className="vn-flex vn-items-center vn-gap-2">
                  <button
                    className="vn-px-3 vn-py-1 vn-bg-gray-300 vn-rounded"
                    onClick={() => handleDecrement(item.product)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="vn-px-3 vn-py-1 vn-bg-gray-300 vn-rounded"
                    onClick={() => handleIncrement(item.product)}
                  >
                    +
                  </button>
                  <button
                    className="vn-text-red-500"
                    onClick={() => onRemoveFromCart(item.product)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pricing Summary */}
          <div className="vn-space-y-3">
            <div className="vn-flex vn-justify-between">
              <span>Subtotal:</span>
              <span>{calculateSubtotal()}</span>
            </div>
            <div className="vn-flex vn-justify-between">
              <span>Tax:</span>
              <span>{calculateTax(parseFloat(calculateSubtotal()))}</span>
            </div>
            <div className="vn-flex vn-justify-between vn-font-bold">
              <span>Total:</span>
              <span>{calculateTotal()}</span>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="vn-flex vn-gap-3 vn-mt-4">
            <button
              className="vn-flex-1 vn-bg-green-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-green-600"
              onClick={() => {
                setLogPayment("Mpesa");
              }}
            >
              Mpesa
            </button>
            <button
              className="vn-flex-1 vn-bg-primary vn-text-white vn-rounded vn-py-2 hover:vn-bg-primary"
              onClick={() => setLogPayment("Cash")}
            >
              Cash
            </button>
            <button
              className="vn-flex-1 vn-bg-yellow-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-yellow-600"
              onClick={() => setLogPayment("Credit")}
            >
              Credit
            </button>
          </div>
          <>
          {logPayment === 'Mpesa' &&  phoneNumber.length !== 12 && (
            <div>
              <input type='text'
              placeholder="254XXXXXXXXX"
              value={phoneNumber}
              onChange={handleChange}
              maxLength={12}
              className={`border ${err ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
              />
              {err && <p className="text-red-500 text-sm">{err}</p>}
            </div>
          )}
          </>
          <button
            className="vn-w-full vn-bg-primary vn-text-white vn-rounded vn-py-3 vn-mt-4 hover:bg-blue-600"
            onClick={() => handleRecordSale(logPayment)}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSummary;

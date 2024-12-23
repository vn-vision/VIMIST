import GenericCard from "./GenericCard";

function AddSaleComponent() {
  return (
    <div className="vn-flex vn-gap-5 vn-min-w-full vn-p-5 vn-bg-gray-100">
      {/* Scrollable Product Cards Section */}
      <div className="vn-grid sm:vn-grid-cols-1 md:vn-grid-cols-2 lg:vn-grid-cols-3 vn-gap-4 vn-w-[60%] vn-h-[70vh] vn-overflow-y-auto vn-p-2 vn-bg-white vn-rounded vn-shadow-md">
        <GenericCard />
        <GenericCard />
        <GenericCard />
        <GenericCard />
        <GenericCard />
        <GenericCard />
        <GenericCard />
        <GenericCard />
      </div>

      {/* Fixed Sales Summary Section */}
      <div className="vn-flex vn-flex-col vn-gap-5 vn-w-[30%] vn-bg-white vn-shadow-md vn-rounded vn-p-5">
        {/* Item Summary */}
        <div className="vn-flex vn-flex-col vn-gap-3">
          <div className="vn-flex vn-justify-between vn-items-center">
            <span>Rice: 20 kg</span>
            <div className="vn-flex vn-gap-2">
              <button className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400">+</button>
              <button className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400">-</button>
            </div>
          </div>
          <div className="vn-flex vn-justify-between vn-items-center">
            <span>Maize: 10 kg</span>
            <div className="vn-flex vn-gap-2">
              <button className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400">+</button>
              <button className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400">-</button>
            </div>
          </div>
          <div className="vn-flex vn-justify-between vn-items-center">
            <span>Mandazi: 20 pcs</span>
            <div className="vn-flex vn-gap-2">
              <button className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400">+</button>
              <button className="vn-px-2 vn-py-1 vn-bg-gray-300 vn-rounded hover:vn-bg-gray-400">-</button>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="vn-border-t vn-border-gray-200 vn-pt-3">
          <div className="vn-flex vn-justify-between">
            <span>Subtotal:</span>
            <span>____</span>
          </div>
          <div className="vn-flex vn-justify-between">
            <span>Tax:</span>
            <span>____</span>
          </div>
          <div className="vn-flex vn-justify-between vn-font-bold">
            <span>Total:</span>
            <span>____</span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="vn-flex vn-gap-3 vn-mt-4">
          <button className="vn-w-1/2 vn-bg-green-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-green-600">
            Mpesa
          </button>
          <button className="vn-w-1/2 vn-bg-blue-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-blue-600">
            Cash
          </button>
          <button className="vn-w-1/2 vn-bg-yellow-500 vn-text-white vn-rounded vn-py-2 hover:vn-bg-blue-600">
            Credit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSaleComponent;

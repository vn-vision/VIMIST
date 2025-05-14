import { useState, useEffect } from "react";
import { BsCartPlus, BsCartX } from "react-icons/bs";

interface GenericCardProps {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  image: File | string | null;
  addToCart: () => void;
  removeFromCart: (id: number) => void;
}

function GenericCard({
  id,
  name,
  category,
  unit_price,
  image,
  addToCart,
  removeFromCart,
}: GenericCardProps) {
  const [processedImage, setProcessedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let imageUrl: string | undefined;

    if (image instanceof File) {
      imageUrl = URL.createObjectURL(image);
      setProcessedImage(imageUrl);
    } else {
      setProcessedImage(image ?? "https://via.placeholder.com/250"); // Fallback image
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image]);

  return (
    <div className="vn-flex vn-flex-col vn-max-w-[90%] vn-h-fit vn-m-4 vn-p-4 vn-border vn-border-gray-200 vn-rounded-xl vn-shadow-md hover:vn-shadow-lg vn-transition-shadow vn-bg-white">
      {/* Image Container with Skeleton Loader */}
      <div className="vn-relative vn-w-full vn-h-40 vn-mb-4 vn-overflow-hidden vn-rounded-lg">
        {loading && <div className="vn-absolute vn-inset-0 vn-bg-gray-200 vn-animate-pulse" />}
        <img
          src={processedImage}
          alt={`${name} - ${category}`}
          className="vn-w-full vn-h-full vn-object-cover vn-rounded-lg"
          onLoad={() => setLoading(false)}
        />
      </div>

      {/* Product Info */}
      <div className="vn-flex vn-flex-col vn-gap-1">
        <p className="vn-text-sm vn-font-medium vn-text-gray-500">{category}</p>
        <p className="vn-text-lg vn-font-bold vn-text-gray-800">{name}</p>
        <p className="vn-text-md vn-font-semibold vn-text-gray-900">
          Price: <span className="vn-text-green-600">${unit_price}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="vn-grid vn-grid-cols-2 vn-gap-4 vn-mt-3">
        <button
          onClick={addToCart}
          className="vn-flex vn-items-center vn-justify-center vn-p-3 vn-rounded-lg vn-bg-green-500 vn-text-white hover:vn-bg-green-600 vn-transition-all"
          aria-label="Add to cart"
        >
          <BsCartPlus className="vn-w-5 vn-h-5" />
        </button>
        <button
          onClick={() => removeFromCart(id)}
          className="vn-flex vn-items-center vn-justify-center vn-p-3 vn-rounded-lg vn-bg-red-500 vn-text-white hover:vn-bg-red-600 vn-transition-all"
          aria-label="Remove from cart"
        >
          <BsCartX className="vn-w-5 vn-h-5" />
        </button>
      </div>
    </div>
  );
}

export default GenericCard;

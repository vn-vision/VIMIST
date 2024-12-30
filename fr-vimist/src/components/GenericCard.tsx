import { useState, useEffect } from "react";
interface GenericCardProps {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  image: File | string | null;
  addToCart: () => void;
  removeFromCart: (id: number) => void;
};

function GenericCard({id, name, category, unit_price, image, addToCart, removeFromCart }: GenericCardProps) {
  const [processedImage, setProcessedImage] = useState<string>('');

  useEffect(() =>{
    let imageUrl: string | undefined;

    if (image instanceof File){
      imageUrl = URL.createObjectURL(image);
      setProcessedImage(imageUrl);
    } else {
      setProcessedImage(image ?? '');
    }

    return () => {
      if (imageUrl){
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(imageUrl);
      }
    };
    }, [image]);

  return (
    <div className='vn-flex vn-flex-col vn-w-[50%] vn-h-[50%]'>
        <img src={processedImage} alt={name && category} className='vn-w-full vn-h-[50%]' />
        <div>
            <p>{name}</p>
            <p>{category}</p>
            <p>Price: {unit_price}</p>
            <div className='vn-flex vn-justify-evenly'>
                <button onClick={()=>{addToCart(); console.log("Clicked")}}>ADD</button>
                <button onClick={()=>(removeFromCart(id))}>Remove</button>
            </div>
        </div>
    </div>
  )
}

export default GenericCard

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TopNavbar({onSearch}: {onSearch: (query: number | string)=>void}) {

  const [searchItem, setSearchItem] = useState<number | string>("");
  
  // set navigate
  const navigate = useNavigate();
  
  // search for an item based on ID or Category or Name
  const handleSearch = () => {
    if (searchItem){
      onSearch(searchItem);
    }
  };
  return (
    <div className='vn-flex vn-max-h-40 vn-w-full vn-justify-between'>
      <div>
        <input
        type='text'
        placeholder='Search item'
        value={searchItem}
        onChange={(e)=>setSearchItem(e.target.value)}
        className='vn-p-2 vn-rounded-l-lg vn-border vn-border-gray-300' />
        <button onClick={handleSearch}
        className="vn-px-4 vn-p-2 vn-rounded-r-lg vn-bg-blue-600 vn-text-white"
        > Search </button>
      </div>
      <div>
        <button
        className='vn-px-4 vn-py-2 vn-rounded vn-bg-red-600 vn-text-white'
        onClick={()=>navigate('/reports')}
        >Notifications</button>
      </div>
    </div>
  )
}

export default TopNavbar;

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
    <div className='vn-flex vn-flex-col sm:vn-flex-row vn-max-h-40 vn-w-full vn-justify-between vn-px-4'>
      <div className='vn-flex vn-w-full sm:vn-w-auto vn-mb-4 sm:vn-mb-0'>
        <input
          type='text'
          placeholder='Search item'
          value={searchItem}
          onChange={(e)=>setSearchItem(e.target.value)}
          className='vn-p-2 vn-rounded-l-lg vn-border vn-border-gray-300 vn-w-full sm:vn-w-60 focus:vn-outline-none focus:vn-border-blue-500'
          aria-label="Search for an item"
        />
        <button 
          onClick={handleSearch}
          className="vn-px-4 vn-p-2 vn-rounded-r-lg vn-bg-blue-600 vn-text-white vn-w-full sm:vn-w-auto sm:vn-ml-2 hover:vn-bg-blue-700 focus:vn-ring-2 focus:vn-ring-blue-500"
        > 
          Search 
        </button>
      </div>
      <div>
        <button
          className='vn-px-4 vn-py-2 vn-rounded vn-bg-red-600 vn-text-white hover:vn-bg-red-700 focus:vn-ring-2 focus:vn-ring-red-500'
          onClick={()=>navigate('/reports')}
          aria-label="View notifications"
        >
          Notifications
        </button>
      </div>
    </div>
  )
}

export default TopNavbar;

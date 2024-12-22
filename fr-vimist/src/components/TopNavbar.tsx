function TopNavbar() {
  return (
    <div className='vn-flex vn-max-h-40 vn-w-full vn-justify-between'>
      <div>
        <input type='text' placeholder='Search' className='vn-p-2 vn-rounded-lg vn-border vn-border-gray-300' />
      </div>
      <div>
        <button className='vn-px-4 vn-py-2 vn-rounded vn-bg-red-600 vn-text-white'>Notifications</button>
      </div>
    </div>
  )
}

export default TopNavbar

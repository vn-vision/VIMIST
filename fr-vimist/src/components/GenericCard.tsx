import logo from '../assets/images/logo.jpg';

function GenericCard() {
  return (
    <div className='vn-flex vn-flex-col vn-w-[50%] vn-h-[50%]'>
        <img src={logo} alt='item' className='vn-w-full vn-h-[50%]' />
        <div>
            <p>Rice</p>
            <p>Sindano</p>
            <p>Price: 100.00</p>
            <div className='vn-flex vn-justify-evenly'>
                <button>ADD</button>
                <button>Remove</button>
            </div>
        </div>
    </div>
  )
}

export default GenericCard

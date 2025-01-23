import React from 'react'
import logo from '../../src/assets/images/logo.jpg'
function SettingsComponent() {
  return (
    <div className='vn-flex vn-flex-col vn-gap-3 vn-m-auto vn-w-[50%]'>
      <div className='vn-flex vn-justify-center vn-items-center vn-w-[10%] vn-h-[10%] vn-rounded-full vn-shadow-sm'>
        <img src={logo} alt='Profile' className='vn-w-full vn-h-full'/>
      </div>
      <div className='vn-flex vn-w-full vn-gap-3'>
        <label htmlFor='Name'>
            Name:
        </label>
        <input id='Name' type='text' placeholder='John Doe' />
      </div>
      <div className='vn-flex vn-w-full vn-gap-3'>
        <label htmlFor='email'>
            Email:
        </label>
        <input id='email' type='text' placeholder='johndoe@gmail.com' />
      </div>
      <div className='vn-flex vn-w-full vn-gap-3'>
        <label htmlFor='pass'>
            Password:
        </label>
        <input id='pass' type='text' placeholder='***change password***' />
      </div>
      <div className='vn-flex vn-m-auto'>
        <button className='vn-flex vn-justify-center vn-items-center vn-border vn-border-green-500' >Update</button>
        <button className='vn-flex vn-justify-center vn-items-center vn-border vn-border-red-500' >Cancel</button>
      </div>
    </div>
  )
}

export default SettingsComponent;

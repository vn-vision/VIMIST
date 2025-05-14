import React from 'react'
import AuthComponent from '../components/AuthComponent'

function RegisterAdmin() {
  return (
    <div className="vn-flex vn-flex-col md:vn-flex-row vn-h-full vn-justify-between">
      <h1 className='vn-text-nowrap vn-text-xl vn-font-semibold'>Register Admin</h1>
      <AuthComponent mode="register" regAs="admin" />
    </div>
  )
}

export default RegisterAdmin

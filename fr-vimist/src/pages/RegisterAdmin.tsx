import React from 'react'
import AuthComponent from '../components/AuthComponent'

function RegisterAdmin() {
  return (
    <div className="vn-flex vn-h-full vn-gap-5">
      <h1>Register Admin</h1>
      <AuthComponent mode="register" regAs="admin" />
    </div>
  )
}

export default RegisterAdmin

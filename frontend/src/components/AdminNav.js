import React from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/admin/userlist', label: 'Users', icon: 'fa-users' },
  { to: '/admin/productlist', label: 'Products', icon: 'fa-box' },
  { to: '/admin/orderlist', label: 'Orders', icon: 'fa-receipt' },
]

const AdminNav = () => (
  <nav className='tabs' aria-label='Admin sections'>
    {LINKS.map((link) => (
      <NavLink key={link.to} to={link.to} className='tabs__link' activeClassName='is-active'>
        <i className={`fas ${link.icon}`} aria-hidden='true' />
        {link.label}
      </NavLink>
    ))}
  </nav>
)

export default AdminNav

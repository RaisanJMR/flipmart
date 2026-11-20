import React from 'react'
import { Link } from 'react-router-dom'

const BackLink = ({ to, children = 'Back' }) => (
  <Link to={to} className='back-link'>
    <i className='fas fa-arrow-left' aria-hidden='true' />
    {children}
  </Link>
)

export default BackLink

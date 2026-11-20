import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='site-footer'>
      <div className='container site-footer__inner'>
        <p>&copy; {new Date().getFullYear()} Flipbay. All rights reserved.</p>
        <nav aria-label='Footer'>
          <ul className='site-footer__links'>
            <li>
              <Link to='/'>Shop</Link>
            </li>
            <li>
              <Link to='/cart'>Cart</Link>
            </li>
            <li>
              <Link to='/profile'>Account</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer

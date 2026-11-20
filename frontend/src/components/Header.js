import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, Route, useLocation } from 'react-router-dom'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'
import Dropdown from './ui/Dropdown'
import Button from './ui/Button'
import ThemeToggle from './ui/ThemeToggle'

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const { cartItems } = useSelector((state) => state.cart)
  const cartCount = cartItems.reduce((acc, item) => acc + Number(item.qty), 0)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const logoutHandler = () => {
    dispatch(logout())
  }

  const renderNav = (idPrefix) => (
    <>
      <NavLink to='/cart' className='nav-link' activeClassName='is-active'>
        <i className='fas fa-shopping-bag' aria-hidden='true' />
        Cart
        {cartCount > 0 && (
          <span className='cart-count'>
            {cartCount}
            <span className='visually-hidden'> items</span>
          </span>
        )}
      </NavLink>

      {userInfo && userInfo.isAdmin && (
        <Dropdown
          id={`${idPrefix}-admin-menu`}
          label={
            <>
              <i className='fas fa-th-large' aria-hidden='true' />
              Admin
            </>
          }
        >
          <Link to='/admin/userlist' className='dropdown__item'>
            <i className='fas fa-users' aria-hidden='true' />
            Users
          </Link>
          <Link to='/admin/productlist' className='dropdown__item'>
            <i className='fas fa-box' aria-hidden='true' />
            Products
          </Link>
          <Link to='/admin/orderlist' className='dropdown__item'>
            <i className='fas fa-receipt' aria-hidden='true' />
            Orders
          </Link>
        </Dropdown>
      )}

      {userInfo ? (
        <Dropdown
          id={`${idPrefix}-user-menu`}
          label={
            <>
              <span className='avatar' aria-hidden='true'>
                {initials(userInfo.name)}
              </span>
              <span className='visually-hidden'>Account menu for </span>
              {userInfo.name}
            </>
          }
          header={
            <>
              <strong>{userInfo.name}</strong>
              <span>{userInfo.email}</span>
            </>
          }
        >
          <Link to='/profile' className='dropdown__item'>
            <i className='fas fa-user' aria-hidden='true' />
            Profile & orders
          </Link>
          <div className='dropdown__separator' role='separator' />
          <button
            type='button'
            className='dropdown__item dropdown__item--danger'
            onClick={logoutHandler}
          >
            <i className='fas fa-sign-out-alt' aria-hidden='true' />
            Sign out
          </button>
        </Dropdown>
      ) : (
        <Button to='/login' variant='primary' size='sm'>
          Sign in
        </Button>
      )}
    </>
  )

  return (
    <header className='site-header'>
      <a href='#main' className='skip-link'>
        Skip to content
      </a>
      <div className='container'>
        <div className='site-header__bar'>
          <Link to='/' className='brand' aria-label='Flipbay home'>
            <span className='brand__mark' aria-hidden='true'>
              F
            </span>
            Flipbay
          </Link>

          <div className='site-header__search'>
            <Route render={({ history }) => <SearchBox history={history} />} />
          </div>

          <div className='site-header__actions'>
            <nav className='site-header__nav' aria-label='Main'>
              {renderNav('desktop')}
            </nav>
            <NavLink
              to='/cart'
              className='nav-link site-header__cart-mobile'
              activeClassName='is-active'
              aria-label={`Cart, ${cartCount} items`}
            >
              <i className='fas fa-shopping-bag' aria-hidden='true' />
              {cartCount > 0 && (
                <span className='cart-count' aria-hidden='true'>
                  {cartCount}
                </span>
              )}
            </NavLink>
            <ThemeToggle />
            <Button
              variant='ghost'
              iconOnly
              className='site-header__toggle'
              aria-expanded={menuOpen}
              aria-controls='mobile-menu'
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} aria-hidden='true' />
            </Button>
          </div>
        </div>

        <div id='mobile-menu' className='site-header__panel' hidden={!menuOpen}>
          <Route
            render={({ history }) => <SearchBox history={history} id='mobile-search' />}
          />
          <nav className='site-header__panel-nav' aria-label='Main'>
            {renderNav('mobile')}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

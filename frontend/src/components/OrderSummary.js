import React from 'react'
import { Link } from 'react-router-dom'

const money = (value) => `$${Number(value || 0).toFixed(2)}`

export const OrderItems = ({ items }) => (
  <ul className='line-items'>
    {items.map((item, index) => (
      <li key={index} className='line-item'>
        <div className='line-item__media'>
          <img src={item.image} alt='' />
        </div>
        <div>
          <Link to={`/product/${item.product}`} className='line-item__name'>
            {item.name}
          </Link>
          <p className='line-item__meta'>
            {item.qty} × {money(item.price)}
          </p>
        </div>
        <div className='line-item__controls'>
          <span className='line-item__total'>{money(item.qty * item.price)}</span>
        </div>
      </li>
    ))}
  </ul>
)

export const OrderTotals = ({ itemsPrice, shippingPrice, taxPrice, totalPrice }) => (
  <dl className='summary'>
    <div className='summary__row'>
      <dt>Items</dt>
      <dd>{money(itemsPrice)}</dd>
    </div>
    <div className='summary__row'>
      <dt>Shipping</dt>
      <dd>{Number(shippingPrice) === 0 ? 'Free' : money(shippingPrice)}</dd>
    </div>
    <div className='summary__row'>
      <dt>Tax</dt>
      <dd>{money(taxPrice)}</dd>
    </div>
    <div className='summary__row summary__row--total'>
      <dt>Total</dt>
      <dd>{money(totalPrice)}</dd>
    </div>
  </dl>
)

export const formatAddress = (address = {}) =>
  [address.address, address.city, address.postalCode, address.country]
    .filter(Boolean)
    .join(', ')

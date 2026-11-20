import React from 'react'
import classNames from '../../utils/classNames'

const Badge = ({ tone = 'neutral', dot = false, className, children, ...rest }) => (
  <span
    className={classNames('badge', tone !== 'neutral' && `badge--${tone}`, className)}
    {...rest}
  >
    {dot && <span className='badge__dot' aria-hidden='true' />}
    {children}
  </span>
)

export default Badge

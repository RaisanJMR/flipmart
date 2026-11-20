import React from 'react'
import { Link } from 'react-router-dom'
import classNames from '../../utils/classNames'

const Button = ({
  to,
  variant = 'secondary',
  size,
  block = false,
  iconOnly = false,
  loading = false,
  type = 'button',
  className,
  children,
  disabled,
  ...rest
}) => {
  const classes = classNames(
    'button',
    `button--${variant}`,
    size && `button--${size}`,
    block && 'button--block',
    iconOnly && 'button--icon',
    loading && 'is-loading',
    className
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className='spinner spinner--sm button__spinner' aria-hidden='true' />}
      {children}
    </button>
  )
}

export default Button

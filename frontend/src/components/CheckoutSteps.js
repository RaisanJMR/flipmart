import React from 'react'
import { Link } from 'react-router-dom'
import classNames from '../utils/classNames'

const STEPS = [
  { label: 'Sign in', to: '/login' },
  { label: 'Shipping', to: '/shipping' },
  { label: 'Payment', to: '/payment' },
  { label: 'Place order', to: '/placeorder' },
]

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const enabled = [step1, step2, step3, step4].map(Boolean)
  const currentIndex = enabled.lastIndexOf(true)

  return (
    <nav aria-label='Checkout progress'>
      <ol className='steps'>
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex
          const isComplete = enabled[index] && index < currentIndex
          const label = <span className='steps__label'>{step.label}</span>

          return (
            <li
              key={step.to}
              className={classNames(
                'steps__item',
                isComplete && 'is-complete',
                isCurrent && 'is-current'
              )}
            >
              {enabled[index] ? (
                <Link
                  to={step.to}
                  className='steps__link'
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {label}
                </Link>
              ) : (
                <span className='steps__link' aria-disabled='true'>
                  {label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default CheckoutSteps

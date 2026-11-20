import React from 'react'
import classNames from '../../utils/classNames'

const EmptyState = ({ icon = 'fa-inbox', title, description, action, compact = false }) => (
  <div className={classNames('empty-state', compact && 'empty-state--compact')}>
    <span className='empty-state__icon' aria-hidden='true'>
      <i className={`fas ${icon}`} />
    </span>
    <h2 className='empty-state__title'>{title}</h2>
    {description && <p className='empty-state__description'>{description}</p>}
    {action && <div className='empty-state__action'>{action}</div>}
  </div>
)

export default EmptyState

import React from 'react'

const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className='page-header'>
    <div className='page-header__titles'>
      {eyebrow && <p className='eyebrow'>{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className='page-header__description'>{description}</p>}
    </div>
    {actions && <div className='page-header__actions'>{actions}</div>}
  </div>
)

export default PageHeader

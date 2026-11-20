import React from 'react'

const ICONS = {
  info: 'fa-info-circle',
  success: 'fa-check-circle',
  warning: 'fa-exclamation-triangle',
  danger: 'fa-exclamation-circle',
}

const Message = ({ variant, children }) => {
  const tone = ICONS[variant] ? variant : 'info'
  const urgent = tone === 'danger' || tone === 'warning'

  return (
    <div className={`alert alert--${tone}`} role={urgent ? 'alert' : 'status'}>
      <i className={`fas ${ICONS[tone]} alert__icon`} aria-hidden='true' />
      <div className='alert__content'>{children}</div>
    </div>
  )
}

Message.defaultProps = {
  variant: 'info',
}

export default Message

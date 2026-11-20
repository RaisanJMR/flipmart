import React, { useEffect, useRef, useState } from 'react'
import classNames from '../../utils/classNames'

// Disclosure-style menu: a toggle button that reveals a list of links/actions.
const Dropdown = ({ id, label, triggerClassName = 'nav-link', align = 'end', header, children }) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current && triggerRef.current.focus()
      }
    }
    const handleFocus = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    document.addEventListener('focusin', handleFocus)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('focusin', handleFocus)
    }
  }, [open])

  const handleMenuClick = (e) => {
    if (e.target.closest('a, button')) setOpen(false)
  }

  const menuId = `${id}-menu`

  return (
    <div className='dropdown' ref={rootRef}>
      <button
        ref={triggerRef}
        id={id}
        type='button'
        className={classNames(triggerClassName, 'dropdown__trigger')}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <i className='fas fa-chevron-down dropdown__chevron' aria-hidden='true' />
      </button>
      <div
        id={menuId}
        className={`dropdown__menu dropdown__menu--${align}`}
        hidden={!open}
        onClick={handleMenuClick}
      >
        {header && <div className='dropdown__header'>{header}</div>}
        <ul>{React.Children.map(children, (child) => child && <li>{child}</li>)}</ul>
      </div>
    </div>
  )
}

export default Dropdown

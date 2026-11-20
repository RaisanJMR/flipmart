import React, { useEffect, useRef } from 'react'
import Button from './Button'

// Built on the native <dialog> element, which provides focus trapping,
// Escape-to-close and an inert background for free.
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  icon,
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef(null)
  const onCancelRef = useRef(onCancel)
  onCancelRef.current = onCancel

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || typeof dialog.showModal !== 'function') return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    const handleCancel = (e) => {
      e.preventDefault()
      onCancelRef.current()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onCancel()
  }

  const danger = tone === 'danger'

  return (
    <dialog
      ref={dialogRef}
      className='dialog'
      aria-labelledby='confirm-dialog-title'
      aria-describedby='confirm-dialog-description'
      onClick={handleBackdropClick}
    >
      {open && (
        <>
          <div className='dialog__body'>
            <span
              className={danger ? 'dialog__icon dialog__icon--danger' : 'dialog__icon'}
              aria-hidden='true'
            >
              <i className={`fas ${icon || (danger ? 'fa-exclamation-triangle' : 'fa-question')}`} />
            </span>
            <div>
              <h2 id='confirm-dialog-title' className='dialog__title'>
                {title}
              </h2>
              <p id='confirm-dialog-description' className='dialog__description'>
                {description}
              </p>
            </div>
          </div>
          <div className='dialog__footer'>
            <Button variant='secondary' onClick={onCancel} autoFocus>
              {cancelLabel}
            </Button>
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </>
      )}
    </dialog>
  )
}

export default ConfirmDialog

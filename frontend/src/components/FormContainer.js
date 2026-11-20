import React from 'react'
import classNames from '../utils/classNames'

const FormContainer = ({ children, wide = false, auth = false }) => (
  <div className={classNames('form-shell', wide && 'form-shell--wide', auth && 'form-shell--auth')}>
    {children}
  </div>
)

export default FormContainer

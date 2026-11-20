import React from 'react'
import classNames from '../utils/classNames'

const Loader = ({ label = 'Loading…', inline = false }) => (
  <div className={classNames('loader', inline && 'loader--inline')} role='status'>
    <span className={classNames('spinner', !inline && 'spinner--lg')} aria-hidden='true' />
    <span className={inline ? undefined : 'visually-hidden'}>{label}</span>
  </div>
)

export default Loader

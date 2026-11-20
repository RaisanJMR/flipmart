import React from 'react'
import classNames from '../../utils/classNames'

export const Field = ({ id, label, hint, optional, className, children }) => (
  <div className={classNames('field', className)}>
    {label && (
      <label htmlFor={id} className='field__label'>
        {label}
        {optional && <span className='field__optional'> (optional)</span>}
      </label>
    )}
    {children}
    {hint && (
      <p id={`${id}-hint`} className='field__hint'>
        {hint}
      </p>
    )}
  </div>
)

export const TextField = ({ id, label, hint, optional, className, ...inputProps }) => (
  <Field id={id} label={label} hint={hint} optional={optional} className={className}>
    <input
      id={id}
      className='input'
      aria-describedby={hint ? `${id}-hint` : undefined}
      {...inputProps}
    />
  </Field>
)

export const TextAreaField = ({ id, label, hint, optional, className, ...inputProps }) => (
  <Field id={id} label={label} hint={hint} optional={optional} className={className}>
    <textarea
      id={id}
      className='textarea'
      aria-describedby={hint ? `${id}-hint` : undefined}
      {...inputProps}
    />
  </Field>
)

export const SelectField = ({
  id,
  label,
  hint,
  optional,
  className,
  children,
  ...selectProps
}) => (
  <Field id={id} label={label} hint={hint} optional={optional} className={className}>
    <select
      id={id}
      className='select'
      aria-describedby={hint ? `${id}-hint` : undefined}
      {...selectProps}
    >
      {children}
    </select>
  </Field>
)

export const Checkbox = ({ id, label, description, className, ...inputProps }) => (
  <label htmlFor={id} className={classNames('choice', className)}>
    <input id={id} type='checkbox' className='choice__input' {...inputProps} />
    <span className='choice__text'>
      <span>{label}</span>
      {description && <span className='choice__description'>{description}</span>}
    </span>
  </label>
)

import React from 'react'
import Badge from './ui/Badge'

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const PaidStatus = ({ isPaid, paidAt }) =>
  isPaid ? (
    <Badge tone='success' dot>
      Paid{paidAt ? ` · ${formatDate(paidAt)}` : ''}
    </Badge>
  ) : (
    <Badge tone='warning' dot>
      Unpaid
    </Badge>
  )

export const DeliveryStatus = ({ isDelivered, deliveredAt }) =>
  isDelivered ? (
    <Badge tone='success' dot>
      Delivered{deliveredAt ? ` · ${formatDate(deliveredAt)}` : ''}
    </Badge>
  ) : (
    <Badge dot>Not delivered</Badge>
  )

export { formatDate }

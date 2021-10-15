import React from 'react'
import { Helmet } from 'react-helmet'
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome top FLIPBAY',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buyelectronics, cannon, apple products',
}

export default Meta

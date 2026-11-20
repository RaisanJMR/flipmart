import React, { useEffect } from 'react'
import Meta from '../components/Meta'
import { useDispatch, useSelector } from 'react-redux'
import Product, { ProductSkeleton } from '../components/Product'
import { listProducts } from '../actions/productActions'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />
      {!keyword && (
        <>
          <h1 className='visually-hidden'>Flipbay store</h1>
          <ProductCarousel />
        </>
      )}

      <section aria-labelledby='products-heading'>
        <div className='section__header'>
          <div className='stack stack--sm'>
            <p className='eyebrow'>{keyword ? 'Search results' : 'Catalog'}</p>
            {keyword ? (
              <h1 id='products-heading'>Results for “{keyword}”</h1>
            ) : (
              <h2 id='products-heading' className='title-lg'>
                Latest products
              </h2>
            )}
          </div>
          {keyword && (
            <Button to='/' variant='ghost' size='sm'>
              <i className='fas fa-times' aria-hidden='true' />
              Clear search
            </Button>
          )}
        </div>

        {loading ? (
          <div className='product-grid' role='status' aria-label='Loading products'>
            {[...Array(8).keys()].map((x) => (
              <ProductSkeleton key={x} />
            ))}
          </div>
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : products.length === 0 ? (
          <EmptyState
            icon='fa-search'
            title='No products found'
            description={
              keyword
                ? `We couldn’t find anything matching “${keyword}”. Try a different search term.`
                : 'There are no products to show yet.'
            }
            action={
              keyword && (
                <Button to='/' variant='secondary'>
                  Browse all products
                </Button>
              )
            }
          />
        ) : (
          <>
            <div className='product-grid'>
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
            <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
          </>
        )}
      </section>
    </>
  )
}

export default HomeScreen

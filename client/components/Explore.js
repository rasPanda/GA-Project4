import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Explore() {
  const [products, getProducts] = useState([])
  const [loading, updateLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      await axios.get('/api/product')
        .then(res => {
          getProducts(res.data)
        })
      updateLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <main>
      <div>
        Loading products
      </div>
    </main>
  }

  return <main className='hero mr-6'>
    <section className="section has-text-centered">
      <h2 className='heading'>Explore products.</h2>
    </section>
    <section className="section has-text-centered">
      <div className='container pl-2 pr-0'>
        <div className='columns is-multiline is-mobile'>
          {products.map((product) => {
            return <Link className='column is-half-desktop is-half-tablet is-full-mobile' key={product.id} to={`/product/${product.id}`}>
              <article className='card' id='list-box-header'>
                <div id='list-box' className='media-content'>
                  <img id='explore-img' src={product.image} />
                </div>
              </article>
            </Link>
          })}
        </div>
      </div>
    </section>
    <section className="section is-large"></section>
  </main >
}
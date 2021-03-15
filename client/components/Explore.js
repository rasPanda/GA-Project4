import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Explore() {
  const [products, getProducts] = useState([])
  const [loading, updateLoading] = useState(true)

  console.log(products)

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

  return <main>
    <h2>Explore products</h2>
    {products.map((product) => {
      return <Link key={product.id} to={`/product/${product.id}`}>
        <div>
          <img width='100%' src={product.image} />
          <div>{product.name}</div>
        </div>
      </Link>
    })}
  </main>
}
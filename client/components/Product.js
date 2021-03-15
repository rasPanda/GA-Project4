import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Product({ match, location }) {
  const token = localStorage.getItem('token')
  const productId = match.params.id
  const boardId = location.state.boardId
  const [purchased, updatePurchased] = useState(location.state.purchased)
  const [loading, updateLoading] = useState(true)
  const [product, getProduct] = useState({})
  const [offSite, updateOffSite] = useState(false)
  const [errors, updateErrors] = useState('')

  useEffect(() => {
    async function fetchBoard() {
      await axios.get(`/api/product/${productId}`)
        .then(res => {
          getProduct(res.data)
        })
      updateLoading(false)
    }
    fetchBoard()
  }, [])

  function goToWebsite() {
    window.open(product.dest_url)
    updateOffSite(true)
  }

  async function markAsPurchased() {
    try {
      await axios.put(`/api/product/${productId}/board${boardId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      updateErrors(err.response.data.messages)
    }
    updateOffSite(false)
    updatePurchased(!purchased)
  }

  if (loading) {
    return <main>
      <div>
        Loading item
      </div>
    </main>
  }

  return <main>
    {offSite && <div>
      <p>Did you purchase this item?</p>
      <button type='button' onClick={() => markAsPurchased()}>Yes</button>
      <button type='button' onClick={() => updateOffSite(false)}>No</button>
    </div>}
    {errors && <div>{errors}</div>}
    <button type='button' onClick={() => window.history.back()}>Go back</button>
    <h2>{product.name}</h2>
    <section>
      <img width='100%' src={product.image} />
      <h3>{product.vendor}</h3>
      <h3>£{product.price}</h3>
      <div>{product.description}</div>
      {!purchased && <button onClick={() => goToWebsite()}>Go to website</button>}
      {purchased === false ?
        <button onClick={() => markAsPurchased()}>Mark as purchased</button>
        :
        <button onClick={() => markAsPurchased()}>Unmark as purchased</button>
      }
      {product.comments.length > 0 &&
        product.comments.map((comment) => {
          return <div key={comment.id}>
            <div>{comment.text}</div>
            <div>{comment.user.username}</div>
          </div>
        })}
    </section>
  </main>
}
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Board({ match }) {
  const boardId = match.params.id
  const [board, getBoard] = useState({})

  useEffect(() => {
    axios.get(`/api/board/${boardId}`)
      .then(res => {
        getBoard(res.data)
      })
  }, [])

  if (!Object.keys(board).length) {
    return <main>
      <div>nothing here!</div>
    </main>
  }

  return <main>
    <button type='button' onClick={() => window.history.back()}>Go back</button>
    <Link to='/board/create'><div>Create new list</div></Link>
    <h2>{board.name}</h2>
    <Link to={{
      pathname: '/product/create',
      state: {
        boardId: boardId
      }
    }}><button type='button'>Add item</button></Link>
    <section>
      {board.products.map((product) => {
        return <section key={product.product.id}>
          {product.purchased === true ?
            <div>purchased</div>
            :
            null}
          <div>£{product.product.price}</div>
          <div>{product.product.vendor}</div>
          <Link to={`/product/${product.product.id}`}>
            <h4>{product.product.name}</h4>
            <img width='100%' src={product.product.image} alt={product.product.name} />
          </Link>
        </section>

      })
      }
    </section>
  </main>
}
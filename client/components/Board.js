import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Board({ match }) {
  const boardId = match.params.id
  const [loading, updateLoading] = useState(true)
  const [board, getBoard] = useState({})

  useEffect(() => {
    async function fetchBoard() {
      await axios.get(`/api/board/${boardId}`)
        .then(res => {
          getBoard(res.data)
        })
      updateLoading(false)
    }
    fetchBoard()
  }, [])

  if (loading) {
    return <main>
      <div>
        Loading list
      </div>
    </main>
  }

  if (!loading && !Object.keys(board).length) {
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
    }}><button type='button'>Add item to this list</button></Link>
    <section>
      {board.products.map((product) => {
        return <section key={product.product.id}>
          {product.purchased === true ?
            <div>purchased</div>
            :
            null}
          <div>£{product.product.price}</div>
          <div>{product.product.vendor}</div>
          <Link to={{
            pathname: `/product/${product.product.id}`,
            state: {
              boardId: boardId,
              purchased: product.purchased
            }
          }}>
            <h4>{product.product.name}</h4>
            <img width='100%' src={product.product.image} alt={product.product.name} />
          </Link>
        </section>
      })}
    </section>
  </main>
}
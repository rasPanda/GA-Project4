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

  if (!loading && !Object.keys(board.products).length) {
    return <main className='hero mr-6'>
      <section className="section is-small has-text-centered">
        <h2 className='title is-2'>{board.name}</h2>
        <Link to={{
          pathname: '/product/create',
          state: {
            boardId: boardId
          }
        }}><div className='button'>Add item to this list</div></Link>
        <div className='hero-body title is-5'>nothing here!</div>
      </section>
      <section className="section is-large"></section>
    </main>
  }

  return <main className='hero mr-6'>
    <section className="section is-small has-text-centered">
      <Link to={{
        pathname: '/product/create',
        state: {
          boardId: boardId
        }
      }}><div className='heading mx-0 mb-0'>Add item to this list.</div></Link>
    </section>
    <section className="section is-small has-text-centered">
      <h2 className='title is-2'>{board.name}</h2>
    </section>
    <section className="section is-small has-text-centered">
      <div className='container'>
        <div className='columns is-multiline is-mobile'>
          {board.products.map((product) => {
            return <div key={product.product.id} className='column is-full'>
              <article className='card mb-6' id='list-box-header'>
                <h4 className='title is-4 is-size-6-mobile is-centered'>{product.product.name}</h4>
                <Link to={{
                  pathname: `/product/${product.product.id}`,
                  state: {
                    boardId: boardId,
                    purchased: product.purchased
                  }
                }}>
                  <div id='list-box' className='media-content p-2'>
                    <img width='100%' src={product.product.image} alt={product.product.name} />
                    <h5 className='subtitle is-6'>£{product.product.price}</h5>
                    <h5 className='subtitle is-6'>{product.product.vendor}</h5>
                    {product.purchased === true ?
                      <h5 className='subtitle is-1 is-size-6-mobile is-6-mobile'>purchased</h5>
                      :
                      null}
                  </div>
                </Link>
              </article>
            </div>
          })}
        </div>
      </div>
    </section>
  </main>
}
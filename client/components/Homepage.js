import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Homepage() {
  const token = localStorage.getItem('token')
  const [boards, getBoards] = useState([])
  const [loading, updateLoading] = useState(true)

  useEffect(() => {
    async function fetchBoards() {
      await axios.get('api/board', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          getBoards(res.data)
        })
      updateLoading(false)
    }
    fetchBoards()
  }, [])

  if (loading) {
    return <main className="hero is-fullheight">
      <section className="hero-body columns is-centered">
        <div>Loading boards</div>
      </section>
    </main>
  }

  if (boards.length === 0) {
    return <main>
      <Link to='/board/create'><h2>Create new list</h2></Link>
      <div>No lists yet, create one!</div>
    </main>
  }

  return <main className='hero mr-6'>
    <section className="section is-small has-text-centered">
      <Link to='/board/create'><p className='heading mx-0 mb-6'>create new list.</p></Link>
    </section>
    <section className="section is-small has-text-centered">
      <div className='container pl-6 pr-0 columns is-multiline is-mobile'>
        {boards.map((board) => {
          const productImages = board.products.map((product) => {
            return product.product.image
          })
          return <Link className='column is-half-desktop is-half-tablet is-full-mobile' key={board.id} to={`/board/${board.id}`}>
            <article className='card' id='list-box-header'>
              <h4 className='title is-4 is-size-5-mobile is-centered'>{board.name}</h4>
              <div id='list-box' className='media-content'>
                <div>
                  <img id='list-img' src={productImages[0] || 'http://www-cdr.stanford.edu/~petrie/blank.gif'} />
                  <img id='list-img' src={productImages[1] || 'http://www-cdr.stanford.edu/~petrie/blank.gif'} />
                </div>
                <div className='media-content'>
                  <img id='list-img' src={productImages[2] || 'http://www-cdr.stanford.edu/~petrie/blank.gif'} />
                  <img id='list-img' src={productImages[3] || 'http://www-cdr.stanford.edu/~petrie/blank.gif'} />
                </div>
              </div>
            </article>
          </Link>
        })
        }
      </div>
    </section>
    <section className="section is-large"></section>
  </main >
}
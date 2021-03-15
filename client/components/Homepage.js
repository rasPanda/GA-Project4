import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Homepage() {
  const token = localStorage.getItem('token')
  const [boards, getBoards] = useState([])
  const [loading, updateLoading] = useState(true)

  useEffect(() => {
    axios.get('api/board', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        getBoards(res.data)
      })
    updateLoading(false)
  }, [])

  console.log(boards)

  if (boards.length === 0 && loading) {
    return <main>
      <div>
        Loading boards
      </div>
    </main>
  } else {
    return <main>
      <Link to='/board/create'><div>Create Board</div></Link>
      {boards.length > 0 && !loading ?
        boards.map((board) => {
          const productImages = board.products.map((product) => {
            return product.product.image
          })
          return <Link key={board.id} to={`/board/${board.id}`}>
            <section>
              <p>{board.name}</p>
              <img width="50" height="60" src={productImages[0]} />
              <img width="50" height="60" src={productImages[1]} />
              <img width="50" height="60" src={productImages[2]} />
              <img width="50" height="60" src={productImages[3]} />
            </section>
          </Link>
        })
        :
        <div>No lists yet, create one!</div>
      }
    </main>
  }


}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Board({ match }) {
  const boardId = match.params.id
  const [board, getBoard] = useState({})

  console.log('hello')
  console.log(boardId)

  useEffect(() => {
    axios.get(`/api/board/${boardId}`)
      .then(res => {
        getBoard(res.data)
      })
  }, [])

  console.log(board)

  return <main>
    {/* <Link to='/board/create'><div>Create new list</div></Link>
    {board.products.map((product) => {
      return <Link key={board.id} to={`/board/${board.id}`}>
        <section>
          <p>{product.name}</p>
        </section>
      </Link>
    })
    } */}
    <div>hello</div>
  </main>
}
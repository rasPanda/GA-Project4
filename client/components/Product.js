import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Product({ match, location,history }) {
  const token = localStorage.getItem('token')
  const productId = match.params.id
  const [boardId, getBoardId] = useState('')
  const [purchased, updatePurchased] = useState('')
  const [loading, updateLoading] = useState(true)
  const [product, getProduct] = useState({})
  const [offSite, updateOffSite] = useState(false)
  const [errors, updateErrors] = useState('')
  const [commentArea, showCommentArea] = useState(false)
  const [commentErrors, updateCommentErrors] = useState(false)
  const [commentText, updateCommentText] = useState('')
  const [commentSuccess, updateCommentSuccess] = useState(false)
  const [userBoards, getBoards] = useState([])
  const [modal, showModal] = useState(false)


  useEffect(() => {
    if (!location.state) {
      //pass 
    } else {
      getBoardId(location.state.boardId)
      updatePurchased(location.state.purchased)
    }
  }, [])


  useEffect(() => {
    async function fetchProduct() {
      await axios.get(`/api/product/${productId}`)
        .then(res => {
          getProduct(res.data)
        })
      updateLoading(false)
    }
    fetchProduct()
  }, [commentSuccess])

  function goToWebsite() {
    window.open(product.dest_url)
    updateOffSite(true)
  }

  useEffect(() => {
    async function fetchBoards() {
      await axios.get('/api/board', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          getBoards(res.data)
        })
    }
    fetchBoards()
  }, [])

  async function addProductToBoard(boardId) {
    try {
      await axios.post(`/api/product/${productId}/board${boardId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      updateErrors(err.response.data.messages)
    }
    setTimeout(() => {
      history.push(`/board/${boardId}`)
    }, 1000)
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

  function handleCommentChange(event) {
    updateCommentErrors('')
    updateCommentText(event.target.value)
  }

  async function handleCommentSubmit(event) {
    event.preventDefault()
    updateCommentErrors('')
    if (!commentText) {
      updateCommentErrors('Cannot post empty comment!')
      return
    }
    const dataToSend = { text: commentText }
    try {
      await axios.post(`/api/comment/product_${productId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      })
      updateCommentSuccess(true)
      showCommentArea(false)
    } catch (err) {
      updateCommentErrors(err.response.data.messages)
    }
  }

  if (loading) {
    return <main>
      <div>
        Loading item
      </div>
    </main>
  }

  return <main className="hero mr-6">
    <button className='button' onClick={() => window.history.back()}>Go back</button>
    {offSite && <div className='modal is-active'>
      <div className='modal-background'></div>
      <div className='modal-content has-text-centered'>
        <p className='modal-text'>Did you purchase this item?</p>
        <button className='button m-1' onClick={() => markAsPurchased()}>Yes</button>
        <button className='button m-1' onClick={() => updateOffSite(false)}>No</button>
      </div>
      <button className='modal-close is-large' aria-label='close' onClick={() => updateOffSite(false)} />
    </div>}
    {errors && <div>{errors}</div>}
    <section className="section is-small has-text-centered">
      <h2 className='title is-4 is-size-6-mobile'>{product.name}</h2>
      <img width='100%' src={product.image} />
      {!boardId && <button className='button m-1' onClick={() => showModal(!modal)}>Add to a list</button>}
      {modal && <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-content has-text-centered'>
          <p className='modal-text title is-4'>Select list to add to</p>
          {userBoards.map((board) => {
            return <div key={board.id} className='modal-link' onClick={() => addProductToBoard(board.id)}>{board.name}</div>
          })}
        </div>
        <button className='modal-close is-large' aria-label='close' onClick={() => showModal(false)} />
      </div>}
      {(boardId && !purchased) && <button className='button m-1' onClick={() => goToWebsite()}>Go to website</button>}
      {(boardId && !purchased) && <button className='button m-1' onClick={() => markAsPurchased()}>Mark as purchased</button>}
      {(boardId && purchased) && <button className='button m-1' onClick={() => markAsPurchased()}>Unmark as purchased</button>}
      <h3 className='subtitle mt-3 is-4 is-size-6-mobile'>{product.vendor}</h3>
      <h3 className='subtitle is-4 is-size-6-mobile'>£{product.price}</h3>
      <div className='is-size-5 is-size-7-mobile'>{product.description}</div>
    </section>
    <section className="section is-small has-text-centered">
      <h4 className='title is-6'>Comments</h4>
      {product.comments.length > 0 ?
        product.comments.map((comment) => {
          return <div key={comment.id}>
            <Link to={`/profile/${comment.user.id}`}><span>{comment.user.username}: </span></Link><span>{comment.text}</span>
          </div>
        })
        :
        <div>No comments!</div>
      }
      <button className='button m-2' onClick={() => showCommentArea(!commentArea)}>Add comment</button>
      {commentArea &&
        <form onSubmit={handleCommentSubmit}>
          <div className="field has-addons">
            <div className='control is-expanded'>
              <input
                className='input'
                type='textarea'
                value={commentText}
                onChange={handleCommentChange}
                name='commentText'
                placeholder='Add comment...'
              />
            </div>
            <div className='control'>
              <button className='button'>Post</button>
            </div>
          </div>
          {commentErrors && <div className="help">{commentErrors}</div>}
        </form>
      }
      {commentSuccess && <div className="help">Comment Added!</div>}
    </section>
  </main>
}
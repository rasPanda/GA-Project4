import React, { useState } from 'react'
import axios from 'axios'

export default function CreateBoard({ history }) {
  const token = localStorage.getItem('token')
  const [boardName, updateBoardName] = useState('')
  const [errors, updateErrors] = useState('')

  function handleChange(event) {
    updateErrors('')
    updateBoardName(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const dataToSend = {
      name: `${boardName}`
    }
    if (boardName.length > 20) {
      updateErrors('Name too long!')
      return
    }
    try {
      console.log(dataToSend)
      axios.post('/api/board', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      })
      history.push('/')
      location.reload()
    } catch (err) {
      updateErrors(err.response.data.messages)
    }
  }

  return <main className="hero is-fullheight-with-navbar">
    <button className='button mr-6' onClick={() => window.history.back()}>Cancel</button>
    <section className="hero-body mt-0 mr-6 columns is-centered">
      <div className="column is-half is-vcentered">
        <h2 className="title is-1">Create a new list</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">List name</label>
            <input
              className='input'
              type='text'
              value={boardName}
              onChange={handleChange}
              name='listName'
              placeholder='My new list'
            />
          </div>
          <div className="control">
            <button className='button'>Create list</button>
          </div>
          {errors && <div className='help'>{errors}</div>}
        </form>
      </div>
    </section>
  </main>
}
import React, { useState } from 'react'
import axios from 'axios'

export default function CreateBoard({ history }) {
  const token = localStorage.getItem('token')
  const [boardName, updateBoardName] = useState('')

  function handleChange(event) {
    updateBoardName(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const dataToSend = {
      name: `${boardName}`
    }
    axios.post('/api/board', dataToSend, {
      headers: { Authorization: `Bearer ${token}` }
    })
    history.push('/')
    location.reload()
  }

  return <main>
    <button type='button' onClick={() => window.history.back()}>Cancel</button>
    <form onSubmit={handleSubmit}>
      <h2>Create a new list</h2>
      <div>
        <label>List name</label>
        <input 
          type='text'
          value={boardName}
          onChange={handleChange}
          name='listName'
          placeholder='My new list'
        />
      </div>
      <button>Create list</button>
    </form>
  </main>
}
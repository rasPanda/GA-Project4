import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ history }) {
  const [loginData, updateLoginData] = useState({
    email: '',
    password: ''
  })

  const [loginErrors, updateLoginErrors] = useState(false)

  function handleLoginChange(event) {
    const { name, value } = event.target
    updateLoginData({ ...loginData, [name]: value })
  }

  async function handleLoginSubmit(event) {
    event.preventDefault()
    try {
      const { data } = await axios.post('/api/login', loginData)
      if (localStorage) {
        localStorage.setItem('token', data.token)
      }
      history.push('/')
      location.reload()
    } catch (err) {
      updateLoginErrors(true)
    }
  }

  return <main>
    <section>
      <form onSubmit={handleLoginSubmit}>
        <h2>Log in</h2>
        <div>
          <label>Email address</label>
          <input 
            type="email"
            value={loginData.email}
            onChange={handleLoginChange}
            name='email'
            placeholder='Enter your email'
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password"
            value={loginData.password}
            onChange={handleLoginChange}
            name='password'
            placeholder='Enter your password'
          />
        </div>
        {loginErrors && <small>Incorrect Login Details, Please Try Again</small>}
        <button>Log in</button>
      </form>
    </section>
  </main>

}
import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ history }) {
  const [loginData, updateLoginData] = useState({
    email: '',
    password: ''
  })

  const [loginErrors, updateLoginErrors] = useState(false)
  const [loginSuccess, updateLoginSuccess] = useState(false)
  const [welcome, getWelcome] = useState('')

  function handleLoginChange(event) {
    updateLoginErrors(false)
    const { name, value } = event.target
    updateLoginData({ ...loginData, [name]: value })
  }

  async function handleLoginSubmit(event) {
    event.preventDefault()
    updateLoginErrors(false)
    try {
      const { data } = await axios.post('/api/login', loginData)
      getWelcome(data.messages)
      if (!localStorage.token) {
        localStorage.setItem('token', data.token)
        updateLoginSuccess(true)
        setTimeout(() => {
          history.push('/')
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      updateLoginErrors(true)
      console.log(err.response)
    }
  }

  return <main className="hero is-fullheight-with-navbar">
    <section className="hero-body mt-0 mr-6 columns is-centered">
      <div className="column is-half is-vcentered">
        <h2 className="title is-1">Log in</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="field">
            <label className="label">Email address</label>
            <div className="control">
              <input
                className='input'
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                name='email'
                placeholder='Enter your email'
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className='input'
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                name='password'
                placeholder='Enter your password'
              />
            </div>
          </div>
          <div className="control">
            <button className='button'>Log in</button>
          </div>
          {loginSuccess && <div className="help">{welcome}</div>}
          {loginErrors && <div className="help">Incorrect Login Details, Please Try Again</div>}
        </form>
      </div>
    </section>
  </main>

}
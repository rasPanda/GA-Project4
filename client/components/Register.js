import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Register({ history }) {
  const [registerData, updateRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const [registerErrors, updateRegisterErrors] = useState('')


  const [registrationSuccess, updateRegistrationSuccess] = useState(false)

  function handleRegisterChange(event) {
    updateRegisterErrors('')
    const { name, value } = event.target
    updateRegisterData({ ...registerData, [name]: value })
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault()
    updateRegisterErrors('')
    if (registerData.password !== registerData.passwordConfirmation) {
      updateRegisterErrors('Passwords do not match')
      return
    }
    try {
      const dataToSend = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      }
      await axios.post('/api/register', dataToSend)
      updateRegistrationSuccess(true)
    } catch (err) {
      updateRegisterErrors(err.response.data.messages)
    }
  }

  useEffect(() => {
    if (registrationSuccess === true)
      setTimeout(() => {
        history.push('/login')
      }, 1500)
  }, [registrationSuccess])

  return <main className="hero is-fullheight-with-navbar">
    <section className="hero-body columns is-centered">
      <div className="column is-half is-vcentered">
        <h2 className="title">Sign up</h2>
        <form onSubmit={handleRegisterSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <input
              className='input'
              type="text"
              value={registerData.username}
              onChange={handleRegisterChange}
              name='username'
              placeholder='Enter your username'
            />
          </div>
          <div className="field">
            <label className="label">Email address</label>
            <input
              className='input'
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              name='email'
              placeholder='Enter your email'
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              className='input'
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              name='password'
              placeholder='Enter your password'
            />
          </div>
          <div className="field">
            <label className="label">Confirm Password</label>
            <input
              className='input'
              type="password"
              value={registerData.passwordConfirmation}
              onChange={handleRegisterChange}
              name='passwordConfirmation'
              placeholder='Confirm your password'
            />
          </div>
          <div className="control">
            <button className='button'>Sumbit</button>
          </div>
          {registerErrors &&
            registerErrors === 'Account exists for this email, Login?' ?
            <small>Account already exists for this email, <Link to={'/login'}>Login?</Link></small> :
            <small>{registerErrors}</small>
          }
          {registrationSuccess && <div className="help">Sign up successful! Redirecting...</div>}
        </form>
      </div>
    </section>
  </main>

}
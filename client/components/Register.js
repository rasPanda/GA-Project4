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
      }, 2000)
  }, [registrationSuccess])

  return <main>
    <section>
      <form onSubmit={handleRegisterSubmit}>
        <h2>Sign up</h2>
        {registrationSuccess && <div><small>Sign Up Successful! Redirecting...</small></div>}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={registerData.username}
            onChange={handleRegisterChange}
            name='username'
            placeholder='Enter your username'
          />
        </div>
        <div>
          <label>Email address</label>
          <input
            type="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            name='email'
            placeholder='Enter your email'
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            name='password'
            placeholder='Enter your password'
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={registerData.passwordConfirmation}
            onChange={handleRegisterChange}
            name='passwordConfirmation'
            placeholder='Confirm your password'
          />
        </div>
        <button>Sumbit</button>
        {registerErrors &&
          registerErrors === 'Account exists for this email, Login?' ?
          <small>Account exists for this email, <Link to={'/login'}>Login?</Link></small> :
          <small>{registerErrors}</small>
        }
      </form>
    </section>
  </main>

}
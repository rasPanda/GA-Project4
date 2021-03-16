import React from 'react'
import { Link } from 'react-router-dom'
import { getLoggedInUserId } from '../lib/auth'

export default function Navbar() {
  const userId = getLoggedInUserId()

  function logOut() {
    localStorage.removeItem('token')
    location.reload()
  }

  return <nav className="level is-mobile">
    <div className='level-left pl-6 pt-4'>
      {!userId ?
        <div className="container">
          <Link to={'/login'} className='link'>Log in</Link>
          <Link to={'/register'} className='level-item'>Register</Link>
        </div>
        :
        <div className="container">
          <Link to={'/'} className='level-item'>HOME</Link>
          <Link to={'/explore'} className='link'>Explore</Link>
          <Link to={`/profile/${userId}`} className='level-item'>Profile</Link>
          <Link to={'/'} onClick={() => logOut()} className='level-item'>Log out</Link>
        </div>
      }
    </div>
    <div className='level-right pr-6 pt-4'>
      <img src='logo placeholder' alt='Listing logo' />
    </div>
  </nav>
}
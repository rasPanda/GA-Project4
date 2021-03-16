import React from 'react'
import { Link } from 'react-router-dom'
import { getLoggedInUserId } from '../lib/auth'
import logo from '../images/listing_logo_small_canvas.png'

export default function Navbar() {
  const userId = getLoggedInUserId()

  function logOut() {
    localStorage.removeItem('token')
    location.reload()
  }

  return <nav className="level mb-0 is-mobile">
    <div className='level-left pl-3'>
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
    <div className='level-right pr-3'>
      <img id='nav-logo' src={logo} alt='Listing logo' />
    </div>
  </nav>
}
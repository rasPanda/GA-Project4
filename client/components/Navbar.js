import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLoggedInUserId } from '../lib/auth'
import logo from '../assets/listing_logo_blue_bg.png'

export default function Navbar() {
  const userId = getLoggedInUserId()
  const [logout, setLogout] = useState(false)

  useEffect(() => {
    if (logout === true) {
      localStorage.removeItem('token')
      location.reload()
      setLogout(false)
    }
  }, [logout])


  return <nav className="level mb-0 is-mobile">
    <div className='level-left pl-3'>
      {!userId ?
        <div className="container">
          <Link to={'/login'} className='level-item'>Log in</Link>
          <Link to={'/register'} className='level-item'>Register</Link>
        </div>
        :
        <div className="container">
          <Link to={'/'} className='level-item'>HOME</Link>
          <Link to={'/explore'} className='level-item'>Explore</Link>
          <Link to={`/profile/${userId}`} className='level-item'>Profile</Link>
          <Link to={'/'} onClick={() => setLogout(true)} className='level-item'>Log out</Link>
        </div>
      }
    </div>
    <div className='level-right pr-3'>
      <img id='nav-logo' src={logo} alt='Listing logo' />
    </div>
  </nav>
}
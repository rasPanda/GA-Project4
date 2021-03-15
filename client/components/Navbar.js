import React from 'react'
import { Link } from 'react-router-dom'
import { getLoggedInUserId } from '../lib/auth'

export default function Navbar() {
  const userId = getLoggedInUserId()

  return <nav>
    <Link to={'/'}><div>Home</div></Link>
    <Link to={`/profile/${userId}`}><div>Profile</div></Link>
    <Link to={'/'}><div>Messages</div></Link>
  </nav>
}
import React from 'react'
import { Link } from 'react-router-dom'

export default function Welcome() {

  return <main>
    <section>
      <img src='logo placeholder' alt='Listing logo' />
      <Link to={'/login'}>
        <button type='button'>Log in</button>
      </Link>
      <Link to='/register'>
        <button type='button'>Sign up</button>
      </Link>
    </section>
  </main>

}

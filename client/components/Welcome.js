import React from 'react'
import squares from '../images/listing_squares.png'

export default function Welcome() {

  return <main className="hero is-fullheight-with-navbar">
    <section className="hero-body mr-6">
      <div className="has-text-centered">
        <div id='squares-div' className="container">
          <img id='squares' src={squares} alt='Listing logo' />
        </div>
      </div>
    </section>
  </main >

}

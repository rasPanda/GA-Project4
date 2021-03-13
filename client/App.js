import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Link, Route } from 'react-router-dom'
import './styles/style.scss'
import axios from 'axios'
import getLoggedInUserId from './lib/auth'

import Homepage from './components/Homepage'
import Welcome from './components/Welcome'
import CreateBoard from './components/CreateBoard'
import Board from './components/Board'
import CreateProduct from './components/CreateProduct'
import Product from './components/Product'
import UserProfile from './components/UserProfile'
// import Navbar from './components/Navbar.js'
// import Footer from './components/Footer.js'

// ! Some starter code for your frontend, change this
// ! however you like.
const App = () => (
  <BrowserRouter>
    {/* <Navbar /> */}
    <Switch>
      {getLoggedInUserId ? 
        <Route exact path="/" component={Homepage} /> :
        <Route exact path="/" component={Welcome} />
      }
      <Route exact path="/board/create" component={CreateBoard} />
      <Route exact path="/board " component={Board} />
      <Route exact path="/product/create" component={CreateProduct} />
      <Route exact path="/product" component={Product} />
      <Route exact path="/profile" component={UserProfile} />
    </Switch>
    {/* <Footer /> */}
  </BrowserRouter>
)

const Home = () => <Link to={'/test/backend'}>
  Go to /hello/world page.
</Link>

// ! Just a little component to test that you can talk to your flask server, check if it
// ! works in network tab.
const TestBackend = () => {
  useEffect(() => {
    // ? This is going to try localhost:5000/api
    axios.get('/api/product')
      .then(({ data }) => console.log(data))
  }, [])

  return <p>
    Hello World
  </p>
}

export default App
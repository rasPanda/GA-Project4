import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './styles/style.scss'
import { getLoggedInUserId } from './lib/auth'

import Homepage from './components/Homepage'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Register from './components/Register'
import CreateBoard from './components/CreateBoard'
import Board from './components/Board'
import CreateProduct from './components/CreateProduct'
import Product from './components/Product'
import UserProfile from './components/UserProfile'
import Explore from './components/Explore'
import Navbar from './components/Navbar'
import Messages from './components/Messages'
// import Footer from './components/Footer.js'

import './styles/style.scss'

const App = () => (
  <BrowserRouter>
    <Navbar />
    {!getLoggedInUserId() ?
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
      :
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/board/create" component={CreateBoard} />
        <Route exact path="/board/:id" component={Board} />
        <Route exact path="/product/create" component={CreateProduct} />
        <Route exact path="/product/:id" component={Product} />
        <Route exact path="/profile/user" component={UserProfile} />
        <Route exact path="/profile/:id" component={UserProfile} />
        <Route exact path="/explore" component={Explore} />
        <Route exact path="/messages" component={Messages} />
      </Switch>
    }
    {/* <Footer /> */}
  </BrowserRouter>
)

export default App
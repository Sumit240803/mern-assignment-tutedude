import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';

function App() {


  return (
    <Router>
      <div><Navbar/></div>
      <div>
        <Routes>
          <Route path='/' element = {<Landing/>}/>
          <Route path='/login' element = {<Auth/>}/>
          <Route path='/profile' element = {<Home/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App

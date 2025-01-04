import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Landing from './pages/Landing';
import Auth from './pages/Auth';

function App() {


  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element = {<Landing/>}/>
          <Route path='/auth' element = {<Auth/>}/>
          <Route path='/profile' element = {<Home/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App

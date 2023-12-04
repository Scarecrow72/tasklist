import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/login/login'
import Tasklist from './components/tasklist/tasklist'
import socketIO from 'socket.io-client'
const socket = socketIO.connect('http://localhost:3000')

function App() {
  return(
    <Routes>
      <Route path='/' element={<Login socket={socket}/>} />
      <Route path='/tasklist' element={<Tasklist socket={socket}/>} />
    </Routes>
  )
}

export default App

import { useState } from 'react'
import Start from './Screens/Start'
import Login from './Screens/Login'
import Register from './Screens/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  

  return (
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Start/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>

     </Routes>
    </BrowserRouter>

    
  );
}

export default App

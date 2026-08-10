import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout, GuestLayout } from './pages/Layout.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Homepage from './pages/Homepage.jsx'
import BuilderPage from './pages/BuilderPage.jsx'
import PreviewPage from './pages/PreviewPage.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
    <Toaster/>
    <Routes>
      {/*Login Routes*/}
      <Route element={<GuestLayout/>}>
        <Route path='/login' element={<AuthPage mode='login'/>} />
        <Route path='/register' element={<AuthPage mode='register'/>} />
      </Route>
      <Route element={<AuthLayout/>}>
        <Route path='/' element={<Homepage/>} />
        <Route path='/builder/:id' element={<BuilderPage/>} />
        <Route path='/preview/:id' element={<PreviewPage/>} />
      </Route>
      <Route path='*' element={<Navigate to="/" replace/>}/>
    </Routes>
    </>
    
  )
}

export default App

import './App.css'
import { Routes, Route } from 'react-router-dom'
import {useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import FloatingShape from './components/FloatingShape'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import EmailVerification from './pages/EmailVerification'
import useAuthStore from './store/authStore'
import Home from './pages/Home'
import LoadingSpinner from './components/LoadingSpinner'
import ForgetPass from './pages/ForgetPass'
import ResetPassword from './pages/ResetPassword'

// protect routes that requires authentacition...
const ProtectedRoute = ({children}) =>{
    const {isAuthenticated, user} = useAuthStore();

    if(!isAuthenticated){
        return <Navigate to='/signin' replace />
    }
    if(!user.isVerified){
        return <Navigate to='/verify-email' replace />
    }

    return children;
}

// redirect authenticted user to home page...
const RedirectAuthenticatedUser = ({children}) =>{
    const {isAuthenticated, user} = useAuthStore();

    if(isAuthenticated && user.isVerified){
        return <Navigate to="/" replace />
    }
    return children;
}


function App() {
  const {isCheckingAuth, checkAuth} =useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  if(isCheckingAuth) return <LoadingSpinner />


  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-700
    flex items-center justify-center relative overflow-hidden'>

      <FloatingShape
      color="bg-blue-400" size="w-64 h-64" top="-5%" left="10%" delay={0}
      />

      <FloatingShape
      color="bg-blue-200" size="w-48 h-48" top="70%" left="80%" delay={5}
      />

      <FloatingShape
      color="bg-blue-500" size="w-32 h-32" top="40%" left="-10%" delay={2}
      />

      <Routes>
        <Route path='/' element={
            <ProtectedRoute>
                <Home/>
            </ProtectedRoute>
         }/>
        <Route
            path='/signup'
            element={
            <RedirectAuthenticatedUser>
                <SignUpPage/>
            </RedirectAuthenticatedUser>
        }/>
        <Route path='/signin' element={
            <RedirectAuthenticatedUser>
                <SignInPage/>
            </RedirectAuthenticatedUser> }/>
        <Route path='/verify-email' element={<EmailVerification/> }/>
        <Route path='/forget-password' element={
            <RedirectAuthenticatedUser>
                <ForgetPass/>
            </RedirectAuthenticatedUser>
        }/>
        <Route path='/reset-password' element={
        <RedirectAuthenticatedUser>
            <ResetPassword/>
        </RedirectAuthenticatedUser>
        } />

        <Route path='*' element={"error 404 not found!!!" } />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App

import React, { useEffect } from 'react'
import Authentication from './Authentication'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './HomePage/HomePage'
import Message from './Components/Message/Message'
import { useDispatch, useSelector } from 'react-redux'
import { getProfileAction } from './Redux/Auth/auth.action'
import { ThemeProvider } from '@emotion/react'
import { DarkTheme } from './theme/DarkTheme'
import { CircularProgress, CssBaseline } from '@mui/material'
import { Box } from '@mui/system'
import { getSavedPostsAction } from './Redux/Post/post.action'

function App() {
  const { auth } = useSelector(store => store)
  const dispatch = useDispatch();

  // Check if user is authenticated
  const isAuthenticated = !!auth.user || !!auth.jwt

  // Get initial auth state on app load
  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    if (jwt && !auth.user) {
      dispatch(getProfileAction(jwt))
    }
    if (auth.user) {
      dispatch(getSavedPostsAction());
    }
    
  }, [dispatch, auth.user])

  // Show loading only when initial auth check is happening
  if (auth.loading && !auth.user && localStorage.getItem("jwt")) {
    return (
      <ThemeProvider theme={DarkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress size={40} />
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline />
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Authentication />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Authentication />
        } />

        {/* Message as separate protected route - NO SIDEBAR */}
        <Route path="/message" element={
          isAuthenticated ? <Message /> : <Navigate to="/login" replace />
        } />

        {/* All other protected routes (with sidebar) */}
        <Route path="/*" element={
          isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
        } />

        {/* Catch all redirect */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/" : "/login"} replace />
        } />
      </Routes>
    </ThemeProvider>
  )
}

export default App
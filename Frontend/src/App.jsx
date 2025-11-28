import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './loadingPage.css'
import LandingPage from './pages/LandingPage'
import SwitchableAuth from './pages/SwitchableAuth.jsx'
import Dashboard from './pages/Dashboard.jsx'

// Loading component using your CSS
function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      backgroundColor: 'white'
    }}>
      <div className="loader"></div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(location)

  useEffect(() => {
    // Only show loading if we're actually changing to a different route
    if (location.pathname !== currentLocation.pathname) {
      setIsLoading(true)
      
      const timer = setTimeout(() => {
        setIsLoading(false)
        setCurrentLocation(location)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [location, currentLocation])

  return (
    <>
      {/* Show loading overlay during route transitions */}
      {isLoading && <Loading />}
      
      {/* Main content - always visible but behind loading screen */}
      <div style={{ 
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        <Routes location={currentLocation}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/SwitchableAuth" element={<SwitchableAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}
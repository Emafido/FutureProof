import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './loadingPage.css'
import LandingPage from './components/LandingPage'
import SwitchableAuth from './components/SwitchableAuth'

// Loading component using your CSS
function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%'
    }}>
      <div className="loader"></div>
    </div>
  )
}

// Page wrapper component to handle loading states
function PageWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time or remove this if you want instant loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Adjust timing as needed

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return children
}

// Main app content with routing
function AppContent() {
  const location = useLocation()

  return (
    <>
      <Routes location={location}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          } 
        />
        {/* Add more routes here as needed */}
        {/* Example:
        <Route 
          path="/about" 
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          } 
        />
        */}
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
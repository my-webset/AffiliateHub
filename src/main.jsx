import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

function Loader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#080c14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      {/* Logo */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: '#0faebd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        boxShadow: '0 0 40px rgba(15,174,189,0.4)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>

      {/* Brand name */}
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: 24,
        color: 'white',
        marginBottom: 32,
        letterSpacing: '-0.5px',
      }}>
        Affiliate<span style={{ color: '#0faebd' }}>Hub</span>
      </div>

      {/* Loading bar */}
      <div style={{
        width: 200,
        height: 3,
        background: '#1a2540',
        borderRadius: 99,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #0faebd, #6ce1eb)',
          borderRadius: 99,
          animation: 'loading 1.5s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(15,174,189,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 60px rgba(15,174,189,0.7); }
        }
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}

function Root() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {show && <Loader />}
      <div style={{ opacity: show ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        <App />
      </div>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)

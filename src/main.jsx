import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>
      <div className="loader-brand">
        Affiliate<span>Hub</span>
      </div>
      <div className="loader-track">
        <div className="loader-bar" />
      </div>
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
      <div style={{ opacity: show ? 0 : 1, transition: 'opacity 0.5s ease' }}>
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

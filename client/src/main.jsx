import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import PlayerContextProvider from './context/PlayerContext.jsx'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <PlayerContextProvider>
        <App />
        <ToastContainer position='top-right' theme='colored' />
      </PlayerContextProvider>
    </Router>
  </StrictMode>,
)

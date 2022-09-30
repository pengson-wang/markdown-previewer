import AnimatedRoutes from './AnimatedRoutes'
import { activeSyncPreferences, deactiveSyncPreferences } from 'states/send-msg' // active send-msg that sending msg back to content-script
import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './app.sass'

export default function App() {
  useEffect(() => {
    activeSyncPreferences()
    return () => {
      deactiveSyncPreferences()
    }
  }, [])
  return (
    <main
      css={`
        width: 100%;
        overflow: auto;
        background-color: #fff;
      `}>
      <Router>
        <AnimatedRoutes />
      </Router>
    </main>
  )
}

import Home from 'pages/home'
import { activeSyncPreferences, deactiveSyncPreferences } from 'states/send-msg' // active send-msg that sending msg back to content-script
import Settings from 'components/settings'
import './app.sass'
import { useEffect } from 'react'

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
        padding-top: 40px;
      `}>
      <Settings
        css={`
          width: 100vw;
        `}
      />
      <Home />
    </main>
  )
}

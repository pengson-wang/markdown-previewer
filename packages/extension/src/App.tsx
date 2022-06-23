import { useEffect } from 'react'
import { sendReadySignal } from './states/general'
import Renderer from 'components/renderer'
import './app.sass'

function App() {
  useEffect(() => {
    sendReadySignal()
  }, [])
  return (
    <div
      css={`
        max-height: 100vh;
        overflow: auto;
        background-color: #fff;
      `}>
      <Renderer />
    </div>
  )
}

export default App

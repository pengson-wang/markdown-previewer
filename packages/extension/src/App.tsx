import { useEffect } from 'react'
import { sendReadySignal } from './states/general'
import Renderer from 'components/render-as-plugin'
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
      <Renderer url={`http://localhost:3006`} />
    </div>
  )
}

export default App

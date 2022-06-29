import { useEffect, useMemo, useState } from 'react'
import { sendReadySignal } from './states/general'
import Renderer from 'components/render-as-plugin'
import './app.sass'

function App() {
  const pluginURL = useMemo(
    () => (process.env.NODE_ENV === 'development' ? 'http://localhost:3006' : chrome.runtime.getURL('renderer/index.html')),
    []
  )
  const [customPluginURL, setCustomPluginURL] = useState<string | null>(null)
  useEffect(() => {
    sendReadySignal()
  }, [])
  return (
    <div
      css={`
        width: 100%;
        overflow: auto;
        background-color: #fff;
      `}>
      <form>
        <label>Custome Plugin URL</label>
        <input type="text" name="url" onChange={(e) => setCustomPluginURL(e.target.value)} />
      </form>
      <Renderer url={customPluginURL || pluginURL} />
    </div>
  )
}

export default App
